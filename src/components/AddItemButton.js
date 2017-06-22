import React from "react";
import {
  View,
  TouchableHighlight,
  Image,
  StyleSheet,
  Animated,
  Easing
} from "react-native";

class AddItemsButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.animatedValueScaleIn = new Animated.Value(0);
  }

  /*--------------------------------------------------
    Lifecycle events
  ----------------------------------------------------*/
  shouldComponentUpdate(nextProps, nextState) {
    // Update only when the Add Item screen gets hidden
    return (
      (this.props.isAddItemVisible === true) &
      (nextProps.isAddItemVisible !== true)
    );
  }

  componentDidUpdate(prevProps, prevState) {
    this.handleScaleIn();
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  handleScaleIn() {
    if (this.props.shouldAnimateAddButton !== true) return;

    this.animatedValueScaleIn.setValue(0);
    Animated.timing(this.animatedValueScaleIn, {
      toValue: 1,
      duration: 300,
      easing: Easing.elastic(1.2),
      delay: 0
      // useNativeDriver: true
    }).start();

    this.props.onAnimateAddButtonComplete();
  }

  getDynamicStyles() {
    const dynamicOpacity = this.props.isAddItemVisible === true ? 0 : 1;

    const animatedStyleScaleIn = {
      transform: [
        // { scale: this.animatedValueScaleIn },
        {
          translateY: this.animatedValueScaleIn.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0]
          })
        }
      ],
      opacity: this.animatedValueScaleIn
    };

    return [animatedStyleScaleIn, { opacity: dynamicOpacity }];
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <View style={styles.show_add_item__container}>
        <Animated.View
          style={[
            styles.show_add_item_sub_container,
            ...this.getDynamicStyles()
          ]}
        >
          <TouchableHighlight
            style={styles.show_add_item__button_container}
            activeOpacity={0.85}
            underlayColor="transparent"
            onPress={() => {
              this.props.onShowAddItem(true);
            }}
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
export { AddItemsButton };
