import React from "react";
import {
  View,
  Text,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  BackHandler,
  Vibration,
  Keyboard,
  Animated
} from "react-native";
import Modal from "react-native-modalbox";
import Toast from "react-native-easy-toast";
import Chroma from "chroma-js";
import { AppStyles, ColorHelper } from "./../components/common/Index";

const AnimatedModal = Animated.createAnimatedComponent(Modal);
const AnimatedTouchableHighlight = Animated.createAnimatedComponent(
  TouchableHighlight
);

class AddItem extends React.Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      addItemValue: "",
      isModalVisible: this.props.isVisible,
      isDisabled: false,
      swipeToClose: true
    };

    this.colorAnimatedValue = new Animated.Value(0);

    // Bind handlers
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleEndEditing = this.handleEndEditing.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleModalVisibility = this.handleModalVisibility.bind(this);
    this.handleBackPress = this.handleBackPress.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  /*--------------------------------------------------
    Lifecycle events
  ----------------------------------------------------*/
  componentDidMount() {
    // BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  handleBackPress() {
    return false;
  }

  handleModalVisibility(isVisible) {
    this.setState({ isModalVisible: isVisible });
  }

  handleChange(event) {
    // Set local state
    this.setState({ addItemValue: event.nativeEvent.text });
  }

  handleBlur(value) {
    console.log("Blur was fired");
  }

  handleEndEditing(event) {
    console.log(`On end editing: ${event.nativeEvent.text}`);
  }

  handleClose() {}

  handleOpen() {}

  handleClosingState(state) {
    Keyboard.dismiss();
  }

  handleSave(event) {
    // Pass state to higher-order component
    this.props.onItemAddition(this.state.addItemValue);

    // Feedback
    // Vibration.vibrate();
    this.refs.toast.show("Saved!");

    // Animate background color
    this.startColorAnimation();

    // Set local state
    this.setState({ addItemValue: "" });
  }

  startColorAnimation() {
    this.colorAnimatedValue.setValue(0);

    Animated.timing(this.colorAnimatedValue, {
      toValue: 100,
      duration: 300
    }).start();
  }

  getAnimationStyles() {
    const { currentColor, nextColor } = ColorHelper.getCurrentAndNextColor();
    const currentColorDark = Chroma(currentColor).darken(1.5).css();
    const nextColorDark = Chroma(nextColor).darken(1.5).css();
    const nextColorDarker = Chroma(nextColor).darken(2).css();

    const interpolateColor = this.colorAnimatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: [currentColor, nextColor]
    });
    const interpolateColorDark = this.colorAnimatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: [currentColorDark, nextColorDark]
    });

    const animatedStyle = {
      colors: {
        currentColor,
        nextColor,
        nextColorDark,
        nextColorDarker
      },
      modal: {
        backgroundColor: interpolateColor
      },
      add_item__title: {
        color: interpolateColorDark
      },
      add_item_save__button: {
        backgroundColor: interpolateColorDark
      },
      toast_text: {
        color: nextColorDark
      }
    };

    return animatedStyle;
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    const animatedStyle = this.getAnimationStyles();

    return (
      <View style={styles.container}>

        <AnimatedModal
          style={[styles.modal, animatedStyle.modal]}
          isOpen={this.state.isModalVisible}
          swipeToClose={this.state.swipeToClose}
          swipeThreshold={150}
          onClosed={this.handleClose}
          onOpened={this.handleOpen}
          onClosingState={this.handleClosingState}
          position={"top"}
          backdrop={false}
          backdropOpacity={0.5}
          backButtonClose={false}
          backdropPressToClose={false}
          startOpen
        >

          <View style={styles.modal_sub_container}>

            <View style={styles.add_item__container}>
              <Animated.Text
                style={[styles.add_item__title, animatedStyle.add_item__title]}
              >
                Remind me to
              </Animated.Text>

              <TextInput
                style={styles.add_item__text}
                value={this.state.addItemValue}
                onChange={this.handleChange}
                onSubmitEditing={this.handleSave}
                onBlur={this.handleBlur}
                onEndEditing={this.handleEndEditing}
                blurOnSubmit={false}
                returnKeyType="done"
                autoCapitalize="sentences"
                multiline
                numberOfLines={3}
                autoFocus
                placeholder="buy milk & bread"
                placeholderTextColor="rgba(255, 255, 255, .3)"
                underlineColorAndroid="transparent"
                caretHidden={false}
                selectionColor="rgba(255, 255, 255, 0.3)"
              />
            </View>
          </View>

          <AnimatedTouchableHighlight
            style={[
              styles.add_item_save__button,
              animatedStyle.add_item_save__button
            ]}
            onPress={this.handleSave}
            activeOpacity={1}
            underlayColor={animatedStyle.colors.nextColorDarker}
          >
            <Text style={styles.add_item_save__title}>Save item</Text>
          </AnimatedTouchableHighlight>

        </AnimatedModal>

        <Toast
          ref="toast"
          style={styles.toast}
          position="top"
          positionValue={108}
          fadeInDuration={200}
          fadeOutDuration={200}
          opacity={1}
          textStyle={styles.toast_text}
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
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
    height: "100%",
    width: "96%"
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: AppStyles.colors.redPrimary,
    borderRadius: 5,
    marginTop: 15,
    elevation: 5
  },
  modal_sub_container: {
    flex: 1,
    paddingHorizontal: 35,
    paddingTop: 35,
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  add_item__container: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap"
  },
  add_item__title: {
    flex: 0,
    color: Chroma(AppStyles.colors.redPrimary).darken(1.5),
    fontSize: 16,
    fontFamily: "Overpass-SemiBold",
    marginTop: 70,
    marginBottom: -8,
    padding: 0
  },
  add_item__text: {
    flex: 1,
    margin: 0,
    marginLeft: -6,
    width: 300,
    fontSize: 36,
    fontFamily: "Overpass-Regular",
    color: "white",
    fontWeight: "100",
    textAlignVertical: "top",
    lineHeight: 50,
    maxHeight: 170
  },
  add_item_save__button: {
    alignSelf: "stretch",
    padding: 18,
    backgroundColor: AppStyles.colors.redSecondary,
    borderColor: "black"
  },
  add_item_save__title: {
    color: "white",
    letterSpacing: 1,
    alignSelf: "center",
    fontSize: 16,
    fontFamily: "Overpass-SemiBold"
  },
  toast: {
    backgroundColor: "transparent",
    alignSelf: "flex-end",
    marginLeft: 25,
    paddingRight: 60
  },
  toast_text: {
    color: "rgba(0,0,0,.5)",
    fontSize: 14,
    fontFamily: "Overpass-SemiBold"
  }
});

/*--------------------------------------------------
    Exports
----------------------------------------------------*/
export { AddItem };
