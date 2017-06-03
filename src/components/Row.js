import React from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import Swipeable from "react-native-swipeable";
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
  componentDidUpdate(prevProps, prevState) {
    this.handleAddAnimation(prevProps.rowID);
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  handleAddAnimation(rowID) {
    if (rowID !== "0" || this.props.onScaleInRowCheck() === false) return;

    this.animatedValueScaleIn.setValue(0);
    Animated.spring(this.animatedValueScaleIn, {
      toValue: 1,
      duration: 100,
      friction: 4,
      tension: 40,
      delay: 0,
      useNativeDriver: false
    }).start();

    this.props.onAnimateRowComplete();
  }

  handleDeleteRow() {
    this.handleDeleteAnimation(({ finished }) => {
      // this.props.onRowDelete(this.props.rowID, this.props.rowData.key);
      // setTimeout(() => {
      //   console.log("Hello");
      //   alert("Hi");
      // }, 1000);
    });
  }

  handleDeleteAnimation(onDeleteAnimationComplete) {
    Animated.timing(this.animatedValueHeight, {
      toValue: 0,
      duration: 200,
      easing: Easing.ease,
      delay: 0,
      useNativeDriver: false
    }).start(onDeleteAnimationComplete); //TODO: Call onDeleteAnimationComplete
  }

  determineRowHeight(event) {
    this.setState({ rowHeight: Math.floor(event.nativeEvent.layout.height) });
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
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
        leftActionActivationDistance={100}
        rightContent={this.renderDeleteAction("right")}
        rightActionActivationDistance={100}
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
                    outputRange: [-10, 0]
                  })
                }
              ]
            }
          ]}
          onLayout={this.determineRowHeight}
        >
          <Text style={styles.item_title}>{this.props.rowData.value}</Text>
        </Animated.View>

      </AnimatedSwipeable>
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
              ? AppStyles.colors.red
              : AppStyles.colors.green
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
