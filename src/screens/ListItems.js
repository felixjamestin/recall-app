import React from "react";
import { View, Text, Image, ListView, StyleSheet } from "react-native";
import { AddItemsButton, Row } from "./../components/Index";
import { AppStyles } from "./../components/common/Index";

class ListItems extends React.Component {
  constructor(props) {
    super(props);

    // Initializations
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    const listItems = this.props.items;
    this.state = {
      dataSource: dataSource.cloneWithRows([listItems])
    };

    // Bindings
    this.handleRenderRow = this.handleRenderRow.bind(this);
    this.handleShowAddItem = this.handleShowAddItem.bind(this);
    this.handleShouldScaleInRow = this.handleShouldScaleInRow.bind(this);
  }

  /*--------------------------------------------------
    Lifecycle events
  ----------------------------------------------------*/
  componentWillReceiveProps(nextProps) {
    // Update listview if the list has changed
    if (this.props.items !== nextProps.items) {
      this.handleItemsUpdate(nextProps.items);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // return this.props.items !== nextProps.items;
    return true;
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  handleRenderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <Row
        rowData={rowData}
        sectionID={sectionID}
        rowID={rowID}
        highlightRow={highlightRow}
        onRowDelete={this.props.onItemDelete}
        onScaleInRowCheck={this.handleShouldScaleInRow}
        isAddItemVisible={this.props.isAddItemVisible}
      />
    );
  }

  handleItemsUpdate(items) {
    if (!items) return;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(items)
    });
  }

  handleScrollToTop() {
    if (!this.hasItems()) return;
    this.refs.listView.scrollTo({ x: 0, y: 0, animated: true });
  }

  handleShowAddItem() {
    this.handleScrollToTop();
    this.props.onShowAddItem();
  }

  hasItems() {
    return this.props.items.length > 0;
  }

  handleShouldScaleInRow() {
    if (this.props.isAddItemVisible) return true;
    return false;
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    const finalItemsView = this.hasItems()
      ? this.renderWhenItems()
      : this.renderWhenNoItems();

    return (
      <View>
        {finalItemsView}
      </View>
    );
  }

  renderWhenNoItems() {
    return (
      <View style={styles.container}>
        <View style={styles.no_items_state}>
          <Image source={require("./../../assets/images/no_items_state.png")} />
        </View>
        <AddItemsButton
          onShowAddItem={this.handleShowAddItem}
          shouldAnimateAddButton={this.props.shouldAnimateAddButton}
          onAddButtonAnimationComplete={this.props.onAddButtonAnimationComplete}
        />
      </View>
    );
  }

  renderWhenItems() {
    return (
      <View style={styles.container}>
        <ListView
          ref="listView"
          style={styles.list_view}
          dataSource={this.state.dataSource}
          renderRow={this.handleRenderRow}
        />
        <AddItemsButton
          onShowAddItem={this.handleShowAddItem}
          shouldAnimateAddButton={this.props.shouldAnimateAddButton}
          onAddButtonAnimationComplete={this.props.onAddButtonAnimationComplete}
        />
      </View>
    );
  }
}

/*---------------------------------------------------
    Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    backgroundColor: AppStyles.colors.redBackground,
    height: "100%",
    width: "100%"
  },
  list_view: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 250,
    marginTop: 0
  },
  no_items_state: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

/*--------------------------------------------------
    Exports
----------------------------------------------------*/
export { ListItems };
