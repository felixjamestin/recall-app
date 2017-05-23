import React from "react";
import { View, AsyncStorage, StatusBar } from "react-native";
import { AddItem, ListItems } from "./Index";
import { AppStyles } from "./../components/common/Index";

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
    this.handleShowAddItem = this.handleShowAddItem.bind(this);
    this.handleItemDeletion = this.handleItemDeletion.bind(this);
  }

  /*--------------------------------------------------
    Lifecycle events
  ----------------------------------------------------*/
  componentWillMount() {
    // this.fetchLocalData();
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
      showAddItem: true
    };
    this.fetchLocalData();
  }

  doAddition(params) {
    const newItems = [
      {
        key: Date.now(),
        value: params.addItemValue
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
    // Delete from array: method 1
    const rowID = parseInt(params.rowID, 10);
    const newItems = this.state.items.filter((item, index) => index !== rowID);

    // Delete from array: method 2
    // const newItems = this.state.items.slice();
    // newItems.splice(params.rowID, 1);

    this.setState({ items: newItems }, () => {
      this.storeLocalData();
    });
  }

  doSetParams(params) {
    this.setState(params);
  }

  handleItemAddition(value) {
    if (!value) return;
    this.setStateHandler(this.getActionEnum().add, { addItemValue: value });
    this.setStateHandler(this.getActionEnum().set, { addItemValue: "" });
  }

  handleItemDeletion(rowID, key) {
    this.setStateHandler(this.getActionEnum().delete, { rowID, key });
  }

  storeLocalData() {
    AsyncStorage.setItem("items", JSON.stringify(this.state.items));
  }

  fetchLocalData() {
    AsyncStorage.getItem("items").then(json => {
      try {
        if (json) {
          const items = JSON.parse(json);
          this.setStateHandler(this.getActionEnum().set, { items });
        }
      } catch (e) {
        console.log(e);
      }
    });
  }

  handleShowAddItem(showAddItem) {
    const shouldShowAddItem = showAddItem;
    this.setStateHandler(this.getActionEnum().set, {
      showAddItem: shouldShowAddItem
    });
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
          onShowAddItem={this.handleShowAddItem}
          onItemDelete={this.handleItemDeletion}
        />
        <AddItem
          isVisible={this.state.showAddItem}
          onItemAddition={this.handleItemAddition}
        />
      </View>
    );
  }
}

/*--------------------------------------------------
    Exports
----------------------------------------------------*/
export { Items };
