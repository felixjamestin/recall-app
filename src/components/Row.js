import React from "react";
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Animated,
  Easing
} from "react-native";
import Swipeable from "react-native-swipeable";
import { AppStyles, ColorHelper } from "./../components/common/Index";

class Row extends React.Component {
  constructor(props) {
    super(props);

    // Initialize data
    this.state = {
      wasDeleteActionActivated: false
    };
    this.animatedValueScaleIn = new Animated.Value(1);

    // Bindings
    this.handleDeleteRow = this.handleDeleteRow.bind(this);
    this.getDynamicStylesForRow = this.getDynamicStylesForRow.bind(this);
  }

  /*--------------------------------------------------
    Lifecycle events
  ----------------------------------------------------*/
  componentDidUpdate(prevProps, prevState) {
    this.handleScaleInFirstRow(prevProps.rowID);
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  handleScaleInFirstRow(rowID) {
    if (rowID !== "0") return;

    this.animatedValueScaleIn.setValue(0);
    Animated.spring(this.animatedValueScaleIn, {
      toValue: 1,
      duration: 100,
      friction: 4,
      tension: 40,
      delay: 0,
      useNativeDriver: true
    }).start();
  }

  handleDeleteRow() {
    this.props.onRowDelete(this.props.rowID, this.props.rowData.key);
  }

  getDynamicStylesForRow() {
    return {
      backgroundColor: ColorHelper.getColorForRow(),
      opacity: this.animatedValueScaleIn,
      transform: [
        {
          translateY: this.animatedValueScaleIn.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 0]
          })
        }
      ]
    };
  }

  /*--------------------------------------------------
    Render
  ----------------------------------------------------*/
  render() {
    return (
      <Swipeable
        leftContent={this.renderDeleteAction("left")}
        leftActionActivationDistance={175}
        rightContent={this.renderDeleteAction("right")}
        rightActionActivationDistance={175}
        onLeftActionActivate={() =>
          this.setState({ wasDeleteActionActivated: true })}
        onLeftActionDeactivate={() =>
          this.setState({ wasDeleteActionActivated: false })}
        onLeftActionComplete={() => this.handleDeleteRow()}
        onRightActionActivate={() =>
          this.setState({ wasDeleteActionActivated: true })}
        onRightActionDeactivate={() =>
          this.setState({ wasDeleteActionActivated: false })}
        onRightActionComplete={() => this.handleDeleteRow()}
      >
        <Animated.View style={[styles.row, this.getDynamicStylesForRow()]}>
          <Text style={styles.item_title}>{this.props.rowData.value}</Text>
        </Animated.View>
      </Swipeable>
    );
  }

  renderDeleteAction(direction) {
    const styleDirection = direction === "left"
      ? styles.row_action_full_swipe_text_left
      : styles.row_action_full_swipe_text_right;

    return (
      <View
        style={[
          styles.row_action_full_swipe,
          {
            backgroundColor: this.state.wasDeleteActionActivated
              ? "red"
              : "green"
          }
        ]}
      >
        {this.state.wasDeleteActionActivated
          ? <Text style={[styles.row_action_full_swipe_text, styleDirection]}>
              Release
            </Text>
          : <Text style={[styles.row_action_full_swipe_text, styleDirection]}>
              Pull to delete
            </Text>}
      </View>
    );
  }
}

/*--------------------------------------------------
    Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  row: {
    borderRadius: 5,
    paddingHorizontal: 33,
    paddingTop: 42,
    paddingBottom: 45,
    marginVertical: 3,
    marginHorizontal: 16,
    minHeight: 125
  },
  item_title: {
    fontSize: 22,
    fontFamily: "Overpass-Regular",
    lineHeight: 34,
    color: "white"
  },
  row_action_button: {
    backgroundColor: AppStyles.colors.redSecondary,
    borderRadius: 5,
    paddingHorizontal: 33,
    marginVertical: 3,
    minHeight: 125,
    justifyContent: "center",
    alignItems: "center",
    width: 130
  },
  row_action_button_text: {
    fontSize: 14,
    fontFamily: "Overpass-Regular",
    color: "white"
  },
  row_action_full_swipe: {
    backgroundColor: AppStyles.colors.redSecondary,
    borderRadius: 5,
    paddingHorizontal: 33,
    marginVertical: 3,
    minHeight: 125,
    justifyContent: "center"
  },
  row_action_full_swipe_text: {
    fontSize: 14,
    color: "white"
  },
  row_action_full_swipe_text_left: {
    alignSelf: "flex-end"
  },
  row_action_full_swipe_text_right: {
    alignSelf: "flex-start"
  }
});

export { Row };
