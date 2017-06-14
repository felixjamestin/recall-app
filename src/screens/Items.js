import React from "react";
import { View, AsyncStorage, StatusBar } from "react-native";
import { AddItem, ListItems } from "./Index";
import { Item, AddItemsButton } from "./../components/Index";
import {
  AppStyles,
  ArrayHelper,
  ColorHelper
} from "./../components/common/Index";

class Items extends React.Component {
  static navigationOptions = {
    title: "Items",
    gesturesEnabled: true
  };

  constructor(props) {
    super(props);

    // Initialize state
    this.setStateHandler(this.getActionEnum().init);

    this.itemsFetched = false;

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
  componentWillUpdate(nextProps, nextState) {
    this.checkAndDeleteItemFromStore(nextProps, nextState);
  }

  componentDidUpdate() {
    this.itemsFetched = false;
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
    this.state = {
      items: [],
      showAddItem: true,
      animateAddButton: true,
      rowToDelete: null
    };
    this.fetchLocalData();
  }

  doAddition(params) {
    const newItems = [
      {
        key: Date.now(),
        value: params.addItemValue,
        selected: false,
        creationTimestamp: new Date(),
        bgColor: ColorHelper.getColorForRow({
          incrementColors: false
        }),
        contentType: "text",
        alarms: []
      },
      ...this.state.items
    ];
    this.setState(
      {
        items: newItems
      },
      () => {
        this.storeLocalData();
      }
    );
  }

  doDeletion(params) {
    this.setState({ rowToDelete: params.rowID });
  }

  doSetParams(params) {
    this.setState(params);
  }

  handleItemAddition(value) {
    if (!value) return;
    this.setStateHandler(this.getActionEnum().add, { addItemValue: value });
    this.setStateHandler(this.getActionEnum().set, {
      addItemValue: "",
      animateRow: true
    });
  }

  handleItemDeletion(rowID, key) {
    this.setStateHandler(this.getActionEnum().delete, { rowID, key });
  }

  checkAndDeleteItemFromStore(nextProps, nextState) {
    if (nextState.rowToDelete === null) return;

    const newItems = ArrayHelper.removeUsingIndex(
      this.state.items,
      nextState.rowToDelete
    );

    this.state.rowToDelete = null;
    this.state.items = newItems; //TODO: Maintain as simple local data, not state
    this.storeLocalData();

    this.setupColorIndex();
  }

  storeLocalData() {
    AsyncStorage.setItem("items", JSON.stringify(this.state.items));
  }

  fetchLocalData() {
    AsyncStorage.getItem("items").then(json => {
      try {
        if (json) {
          const items = JSON.parse(json);
          this.setState(
            {
              items
            },
            () => {
              this.setupColorIndex();
              this.itemsFetched = true;
            }
          );
        }
      } catch (e) {
        console.log(e);
      }
    });
  }

  handleShowAddItem() {
    this.setStateHandler(this.getActionEnum().set, {
      showAddItem: true
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
    this.state.animateRow = false;
  }

  setupColorIndex() {
    // Determine background color to start with based on saved items
    const latestItem = this.state.items[0];
    const rowColors = Object.values(AppStyles.rowColors);
    const relativeIndexInColorArray = rowColors.findIndex(
      value => value === latestItem.bgColor
    );
    const newColorIndex = (relativeIndexInColorArray + 1) % rowColors.length;

    ColorHelper.setColorIndex(newColorIndex);
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <View>
        <StatusBar
          backgroundColor={AppStyles.colors.redBackground}
          barStyle="light-content"
          hidden={false}
        />
        <ListItems
          items={this.state.items}
          isAddItemVisible={this.state.showAddItem}
          shouldAnimateRow={this.state.animateRow}
          shouldAnimateAddButton={this.state.animateAddButton}
          onShowAddItem={this.handleShowAddItem}
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
          itemsFetched={this.itemsFetched}
        />
      </View>
    );
  }
}

/*--------------------------------------------------
    Exports
----------------------------------------------------*/
export { Items };
