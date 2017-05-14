import React from "react";
import {
  View,
  TouchableHighlight,
  Image,
  StyleSheet,
  Animated
} from "react-native";
import AppStyles from "./../components/common/AppStyles";

class addItemsButton extends React.Component {
  constructor(props) {
    super(props);
    this.handlePressIn = this.handlePressIn.bind(this);
    this.handlePressOut = this.handlePressOut.bind(this);
  }

  /*--------------------------------------------------
    Lifecycle events
  ----------------------------------------------------*/
  componentWillMount() {
    this.animatedValue = new Animated.Value(1);
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  handlePressIn() {
    Animated.spring(this.animatedValue, {
      toValue: 0.8
    }).start();
  }
  handlePressOut() {
    Animated.spring(this.animatedValue, {
      toValue: 1,
      friction: 5,
      tension: 80
    }).start();
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    const animatedStyle = {
      transform: [{ scale: this.animatedValue }]
    };

    return (
      <View style={styles.show_add_item__container}>
        <Animated.View
          style={[animatedStyle, styles.show_add_item_sub_container]}
        >
          <TouchableHighlight
            style={styles.show_add_item__button_container}
            activeOpacity={0.85}
            underlayColor="transparent"
            onPress={() => {
              this.props.onShowAddItem(true);
            }}
            onPressIn={this.handlePressIn}
            onPressOut={this.handlePressOut}
          >
            <Image
              style={[styles.show_add_item__button]}
              source={require("./../../assets/images/add_item_button.png")}
            />
          </TouchableHighlight>
        </Animated.View>
      </View>
    );
  }
}

/*---------------------------------------------------
  Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  show_add_item__container: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  show_add_item_sub_container: {
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  show_add_item__button_container: {
    height: 52,
    width: 52,
    borderRadius: 25,
    elevation: 7
  },
  show_add_item__button: {
    paddingTop: 20,
    marginBottom: 10
  }
});

/*---------------------------------------------------
  Exports
----------------------------------------------------*/
export default addItemsButton;
