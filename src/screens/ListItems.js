import React from "react";
import { View, Image, Text, ListView, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import Chroma from "chroma-js";
import { Row } from "./../components/Index";
import { AppStyles } from "./../components/common/Index";

/*--------------------------------------------------
  Component
----------------------------------------------------*/
class ListItems extends React.Component {
  static propTypes = {
    items: PropTypes.object.isRequired,
    isAddItemVisible: PropTypes.bool.isRequired,
    shouldAnimateRow: PropTypes.bool.isRequired,
    shouldAnimateAddButton: PropTypes.bool.isRequired,
    onItemDelete: PropTypes.func.isRequired,
    onAnimateAddButtonComplete: PropTypes.func.isRequired,
    onAnimateRowComplete: PropTypes.func.isRequired
  };

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
    const shouldShowAddItem = nextProps.isAddItemVisible === true; // Scroll list to top

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
    const latestItem = this.props.items.find(value => value.delete !== true);
    return this.props.items.length > 0 && typeof latestItem !== "undefined";
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
          <Image
            source={require("./../../assets/images/no_items_state.gif")}
            style={{ width: 170, height: 170 }}
          />
          <Text style={styles.empty_state__title}>You're all done!</Text>
          <Text style={styles.empty_state__subtitle}>
            and free like a bird :)
          </Text>
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
          contentContainerStyle={styles.list_view_container}
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
    backgroundColor: AppStyles.colors.appBackground,
    height: "100%",
    width: "100%"
  },
  list_view: {
    flex: 1,
    paddingTop: 10,
    marginTop: 0
  },
  list_view_container: {
    paddingBottom: 50
  },
  no_items_state: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -70
  },
  empty_state__title: {
    fontSize: 16,
    color: "white",
    fontFamily: "Overpass-Regular",
    marginTop: -15
  },
  empty_state__subtitle: {
    fontSize: 14,
    color: Chroma(AppStyles.colors.appBackground).brighten(2.2),
    fontFamily: "Overpass-Regular",
    marginTop: 2
  }
});

/*--------------------------------------------------
    Exports
----------------------------------------------------*/
export { ListItems };
