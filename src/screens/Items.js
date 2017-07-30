import React from "react";
import { View, AsyncStorage, StatusBar } from "react-native";
import { AddItem, ListItems, PushController } from "./Index";
import { AddItemsButton, ItemFactory } from "./../components/Index";
import {
  AppStyles,
  ColorHelper,
  AnalyticsHelper
} from "./../components/common/Index";

/*--------------------------------------------------
  Component
----------------------------------------------------*/
class Items extends React.Component {
  static navigationOptions = {
    title: "Items",
    gesturesEnabled: true
  };

  constructor(props) {
    super(props);

    // Initialize state
    this.setStateHandler(this.getActionEnum().init);

    // Bind handlers
    this.setStateHandler = this.setStateHandler.bind(this);
    this.getActionEnum = this.getActionEnum.bind(this);
    this.handleItemAddition = this.handleItemAddition.bind(this);
    this.handleItemDeletion = this.handleItemDeletion.bind(this);
    this.handleShowAddItem = this.handleShowAddItem.bind(this);
    this.handleCloseAddItem = this.handleCloseAddItem.bind(this);
    this.handleStopAddButtonAnimation = this.handleStopAddButtonAnimation.bind(
      this
    );
    this.handleStopRowAnimation = this.handleStopRowAnimation.bind(this);
    this.setupColorIndex = this.setupColorIndex.bind(this);
  }

  /*--------------------------------------------------
    Lifecycle events
  ----------------------------------------------------*/
  componentDidUpdate() {
    this.wereItemsFetched = false;
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  setStateHandler(action, params = {}) {
    if (action === this.getActionEnum().init) {
      this.doInitialization();
    } else if (action === this.getActionEnum().add) {
      this.doAddition(params);
    } else if (action === this.getActionEnum().delete) {
      this.doDeletion(params);
    } else if (action === this.getActionEnum().set) {
      this.doSetParams(params);
    }
  }

  getActionEnum() {
    return {
      init: 1,
      add: 2,
      update: 3,
      delete: 4,
      set: 5
    };
  }

  doInitialization() {
    // Initialize instance state
    this.wereItemsFetched = false;
    this.items = [];

    // Setup analytics
    AnalyticsHelper.initialize();

    // Initialize React state
    this.state = {
      actionPerformed: null,
      showAddItem: true,
      animateAddButton: true,
      rowToDelete: null
    };
    this.fetchLocalData();
  }

  doAddition(params) {
    const newItems = [
      ItemFactory.createItem({
        value: params.addItemValue,
        reminder: params.addItemReminder,
        reminderID: params.addItemRemiderID
      }),
      ...this.items
    ];

    this.items = newItems;
    this.storeLocalData(this.items);

    this.setState({ actionPerformed: this.getActionEnum().add });
  }

  doDeletion(params) {
    // Clone to bypass unnecessary renders in child components
    const clone = this.items.slice(0);
    this.items = clone;

    this.items[params.rowID].delete = true;
    this.storeLocalData(this.items);

    PushController.cancelPushNotification({
      reminderID: this.items[params.rowID].reminderID
    });

    this.setupColorIndex();
    this.setState({ actionPerformed: this.getActionEnum().delete });
  }

  doSetParams(params) {
    this.setState(params);
  }

  handleItemAddition(value, reminderTime, reminderID) {
    if (!value) return;
    this.setStateHandler(this.getActionEnum().add, {
      addItemValue: value,
      addItemReminder: reminderTime,
      addItemRemiderID: reminderID
    });
    this.setStateHandler(this.getActionEnum().set, {
      animateRow: true
    });
  }

  handleItemDeletion(rowID, key) {
    this.setStateHandler(this.getActionEnum().delete, { rowID, key });

    AnalyticsHelper.trackEvent({
      name: "delete_item-deleted",
      value: this.items[rowID].value
    });
  }

  storeLocalData(items) {
    const itemsExcludingDeleted = items.filter(value => {
      return value.delete !== true;
    });
    AsyncStorage.setItem("items", JSON.stringify(itemsExcludingDeleted));
  }

  storeProfileData({ onboardingComplete = false } = {}) {
    const profile = {
      onboardingComplete
    };

    AsyncStorage.setItem("profile", JSON.stringify(profile));
  }

  async fetchLocalData() {
    try {
      const profileJson = await AsyncStorage.getItem("profile");
      const profile = JSON.parse(profileJson);
      const onboardingComplete =
        profile !== null && profile.onboardingComplete === true ? true : false;

      const itemJson = await AsyncStorage.getItem("items");
      const items = JSON.parse(itemJson);
      const doItemsExist = items !== null && items.length > 0;

      this.items = doItemsExist
        ? items
        : this.fetchDefaultItems({ onboardingComplete });
    } catch (e) {
      console.log(e);
    }

    this.setupColorIndex();
    this.wereItemsFetched = true;
    this.setState({ actionPerformed: this.getActionEnum().init });
  }

  fetchDefaultItems({ onboardingComplete = false } = {}) {
    if (onboardingComplete === true) return [];

    const items = [
      ItemFactory.createItem({
        value:
          "Stop juggling 🤹 things in your head. Recall is built to let you offload things quickly.",
        reminder: "",
        incrementColors: true,
        color: AppStyles.rowColors.a
      }),
      ItemFactory.createItem({
        value:
          "Things like people you have to 📱call back, 📚 books recommended by friends or even just groceries 🍞",
        reminder: "",
        incrementColors: true,
        color: AppStyles.rowColors.b
      }),
      ItemFactory.createItem({
        value: "And when you're done with an item? Simply swipe to delete it.",
        reminder: "",
        incrementColors: true,
        color: AppStyles.rowColors.c
      })
    ];

    this.storeLocalData(items);
    this.storeProfileData({ onboardingComplete: true });

    return items;
  }

  handleShowAddItem() {
    this.setStateHandler(this.getActionEnum().set, {
      showAddItem: true
    });

    AnalyticsHelper.trackEvent({
      name: "list_item-shown"
    });
  }

  handleCloseAddItem() {
    this.setStateHandler(this.getActionEnum().set, {
      showAddItem: false,
      animateAddButton: true
    });
  }

  handleStopAddButtonAnimation() {
    this.setStateHandler(this.getActionEnum().set, {
      animateAddButton: false
    });
  }

  handleStopRowAnimation() {
    this.state.animateRow = false; //TODO: Don't pull this up into items...
  }

  setupColorIndex() {
    // Determine background color to start with based on saved items
    const latestItem = this.items.find(item => {
      return item.delete !== true;
    });
    let newColorIndex = 0; // Default in case of no items

    if (typeof latestItem !== "undefined") {
      const rowColors = Object.values(AppStyles.rowColors);
      const relativeIndexInColorArray = rowColors.findIndex(
        value => value === latestItem.bgColor
      );
      newColorIndex = (relativeIndexInColorArray + 1) % rowColors.length;
    }

    ColorHelper.setColorIndex(newColorIndex);
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <View>
        <PushController />
        <StatusBar
          backgroundColor={AppStyles.colors.appBackground}
          barStyle="light-content"
          hidden={false}
        />
        <ListItems
          items={this.items}
          isAddItemVisible={this.state.showAddItem}
          shouldAnimateRow={this.state.animateRow}
          shouldAnimateAddButton={this.state.animateAddButton}
          onItemDelete={this.handleItemDeletion}
          onAnimateAddButtonComplete={this.handleStopAddButtonAnimation}
          onAnimateRowComplete={this.handleStopRowAnimation}
        />
        <AddItemsButton
          isAddItemVisible={this.state.showAddItem}
          onShowAddItem={this.handleShowAddItem}
          shouldAnimateAddButton={this.state.animateAddButton}
          onAnimateAddButtonComplete={this.handleStopAddButtonAnimation}
        />
        <AddItem
          isVisible={this.state.showAddItem}
          onItemAddition={this.handleItemAddition}
          onClose={this.handleCloseAddItem}
          wereItemsFetched={this.wereItemsFetched}
        />
      </View>
    );
  }
}

/*--------------------------------------------------
    Exports
----------------------------------------------------*/
export { Items };
