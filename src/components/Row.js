import React from "react";
import { View, Image, StyleSheet, Animated, Easing } from "react-native";
import Swipeable from "react-native-swipeable";
import { RowTitleText, RowReminderText } from "./Index";
import { AppStyles } from "./../components/common/Index";

const AnimatedSwipeable = Animated.createAnimatedComponent(Swipeable);

class Row extends React.PureComponent {
  constructor(props) {
    super(props);

    // Initialize data
    this.state = {
      wasDeleteActionActivated: false
    };
    this.animatedValueScaleIn = new Animated.Value(1);
    this.animatedValueHeight = new Animated.Value(1);

    // Bindings
    this.handleDeleteRow = this.handleDeleteRow.bind(this);
    this.determineRowHeight = this.determineRowHeight.bind(this);
  }

  /*--------------------------------------------------
    Lifecycle events
  ----------------------------------------------------*/
  componentWillUpdate(nextProps, nextState) {
    this.resetRowHeight(nextProps.rowData.delete, this.props.rowData.delete);
  }

  componentDidUpdate(prevProps, prevState) {
    this.handleAddAnimation(prevProps.rowID);
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  handleAddAnimation(rowID) {
    if (rowID !== "0" || this.props.onScaleInRowCheck() === false) return;

    this.animatedValueScaleIn.setValue(0);
    Animated.timing(this.animatedValueScaleIn, {
      toValue: 1,
      duration: 500,
      delay: 800,
      easing: Easing.elastic(1),
      useNativeDriver: false
    }).start();

    this.props.onAnimateRowComplete();
  }

  handleDeleteRow() {
    this.handleDeleteAnimation(({ finished }) => {
      this.props.onRowDelete(this.props.rowID, this.props.rowData.key);
    });
  }

  handleDeleteAnimation(callback) {
    Animated.timing(this.animatedValueHeight, {
      toValue: 0,
      duration: 200,
      easing: Easing.ease,
      delay: 0,
      useNativeDriver: false
    }).start(callback);
  }

  determineRowHeight(event) {
    this.setState({ rowHeight: Math.floor(event.nativeEvent.layout.height) });
  }

  skipRenderForDeletedRow() {
    return this.props.rowData.delete === true;
  }

  resetRowHeight(oldDeleteValue, newDeleteValue) {
    if (oldDeleteValue === false && newDeleteValue === true) {
      this.animatedValueHeight.setValue(1); //Reset height if row was used by a deleted item before
    }
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    if (this.skipRenderForDeletedRow() === true) return null;

    return (
      <AnimatedSwipeable
        style={{
          opacity: this.animatedValueHeight,
          height: this.animatedValueHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, this.state.rowHeight + 5]
          })
        }}
        leftContent={this.renderDeleteAction("left")}
        leftActionActivationDistance={70}
        rightContent={this.renderDeleteAction("right")}
        rightActionActivationDistance={70}
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
        <Animated.View
          style={[
            styles.row,
            {
              backgroundColor: this.props.rowData.bgColor,
              transform: [
                {
                  translateY: this.animatedValueScaleIn.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0]
                  })
                }
              ]
            }
          ]}
          onLayout={this.determineRowHeight}
        >
          <RowTitleText text={this.props.rowData.value} />
          <RowReminderText reminderDate={this.props.rowData.reminder} />
        </Animated.View>
      </AnimatedSwipeable>
    );
  }

  renderDeleteAction(direction) {
    const styleDirection =
      direction === "left"
        ? styles.row_action_swipe_left
        : styles.row_action_swipe_right;

    return (
      <View style={styles.row_action_swipe}>
        {this.state.wasDeleteActionActivated
          ? <Image
              source={require("./../../assets/images/delete_row_active.png")}
              style={styleDirection}
            />
          : <Image
              source={require("./../../assets/images/delete_row.png")}
              style={styleDirection}
            />}
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
    marginVertical: 3,
    marginHorizontal: 16,
    minHeight: 120
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
  row_action_swipe: {
    paddingHorizontal: 10,
    marginVertical: 3,
    minHeight: 125,
    justifyContent: "center"
  },
  row_action_swipe_left: {
    alignSelf: "flex-end"
  },
  row_action_swipe_right: {
    alignSelf: "flex-start"
  }
});

/*--------------------------------------------------
  Exports
----------------------------------------------------*/
export { Row };
