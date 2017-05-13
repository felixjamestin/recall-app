import React from "react";
import { View, Text, Image, ListView, StyleSheet } from "react-native";
import AddItemsButton from "./../components/AddItemButton";
import AppStyles from "./../components/common/AppStyles";

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

    this.bgColorIndex = 0;

    // Bindings
    this.handleRenderRow = this.handleRenderRow.bind(this);
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

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  getRandomIntInclusive(min, max) {
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);
    return Math.floor(Math.random() * (maxInt - minInt + 1)) + min;
  }

  getRandomColor() {
    const colorKeys = Object.keys(AppStyles.rowColors);
    const colorIndex = this.bgColorIndex % colorKeys.length;
    this.bgColorIndex++;

    return AppStyles.rowColors[colorKeys[colorIndex]];
  }

  handleRenderRow(rowData, sectionID, rowID, highlightRow) {
    const bgColor = this.getRandomColor();
    const dynamicBackground = {
      backgroundColor: bgColor
    };

    return (
      <View style={[styles.row, dynamicBackground]}>
        <Text style={styles.item_title}>{rowData.value}</Text>
      </View>
    );
  }

  handleItemsUpdate(items) {
    if (!items) return;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(items)
    });
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    const hasNoItemsView = (
      <View style={styles.container}>
        <View style={styles.no_items_state}>
          <Image source={require("./../../assets/images/no_items_state.png")} />
        </View>
        <AddItemsButton onShowAddItem={this.props.onShowAddItem} />
      </View>
    );

    const hasItemsView = (
      <View style={styles.container}>
        <ListView
          style={styles.list_view}
          dataSource={this.state.dataSource}
          renderRow={this.handleRenderRow}
        />
        <AddItemsButton onShowAddItem={this.props.onShowAddItem} />
      </View>
    );

    const finalItemsView = this.props.items.length > 0
      ? hasItemsView
      : hasNoItemsView;

    return (
      <View>
        {finalItemsView}
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
    marginTop: 5
  },
  row: {
    borderRadius: 5,
    paddingHorizontal: 33,
    paddingTop: 42,
    paddingBottom: 48,
    marginVertical: 3,
    marginHorizontal: 16
  },
  item_title: {
    fontSize: 22,
    fontFamily: "Overpass-Regular",
    lineHeight: 34,
    color: "white"
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
