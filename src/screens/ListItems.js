import React from "react";
import { View, Image, ListView, StyleSheet } from "react-native";
import { Row } from "./../components/Index";
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
    const haveItemsChanged = this.props.items !== nextProps.items;
    const shouldShowAddItem = nextProps.isAddItemVisible === true;

    return haveItemsChanged || shouldShowAddItem;
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
        onAnimateRowComplete={this.props.onAnimateRowComplete}
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
    if (!this.hasItems() || this.props.isAddItemVisible !== true) return;
    if (this.refs.listView == null) return;

    this.refs.listView.scrollTo({ x: 0, y: 0, animated: true });
  }

  hasItems() {
    return this.props.items.length > 0;
  }

  handleShouldScaleInRow() {
    if (this.props.isAddItemVisible && this.props.shouldAnimateRow) return true;
    return false;
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    this.handleScrollToTop();

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
    paddingTop: 10,
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
