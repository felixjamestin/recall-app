import React from "react";
import { View, Image, FlatList, ListView, StyleSheet } from "react-native";
import { AddItemsButton, Row } from "./../components/Index";
import { AppStyles } from "./../components/common/Index";

class ListItems extends React.PureComponent {
  constructor(props) {
    super(props);

    // Bindings
    this.handleRenderItem = this.handleRenderItem.bind(this);
    this.handleShowAddItem = this.handleShowAddItem.bind(this);
    this.handleShouldScaleInRow = this.handleShouldScaleInRow.bind(this);
    this.getKeyExtractor = this.getKeyExtractor.bind(this);
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  handleRenderItem({ item, index }) {
    return (
      <Row
        rowData={item}
        rowID={index}
        onRowDelete={this.props.onItemDelete}
        onScaleInRowCheck={this.handleShouldScaleInRow}
        onAnimateRowComplete={this.props.onAnimateRowComplete}
      />
    );
  }

  handleScrollToTop() {
    if (!this.hasItems()) return;
    this.listRef.scrollToOffset({ y: 0, animated: true });
  }

  handleShowAddItem() {
    this.handleScrollToTop();
    this.props.onShowAddItem();
  }

  hasItems() {
    return this.props.items.length > 0;
  }

  handleShouldScaleInRow() {
    if (this.props.isAddItemVisible && this.props.shouldAnimateRow) return true;
    return false;
  }

  getKeyExtractor(item, index) {
    return item.key;
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
          isAddItemVisible={this.props.isAddItemVisible}
          onShowAddItem={this.handleShowAddItem}
          shouldAnimateAddButton={this.props.shouldAnimateAddButton}
          onAnimateAddButtonComplete={this.props.onAnimateAddButtonComplete}
        />
      </View>
    );
  }

  renderWhenItems() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.items}
          keyExtractor={this.getKeyExtractor}
          renderItem={this.handleRenderItem}
          shouldItemUpdate={(props, nextProps) => props.item !== nextProps.item}
          ref={ref => {
            this.listRef = ref;
          }}
        />
        <AddItemsButton
          isAddItemVisible={this.props.isAddItemVisible}
          onShowAddItem={this.handleShowAddItem}
          shouldAnimateAddButton={this.props.shouldAnimateAddButton}
          onAnimateAddButtonComplete={this.props.onAnimateAddButtonComplete}
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
