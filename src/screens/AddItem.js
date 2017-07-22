import React from "react";
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  Keyboard,
  Animated,
  KeyboardAvoidingView
} from "react-native";
import PropTypes from "prop-types";
import Modal from "react-native-modalbox";
import Chroma from "chroma-js";
import {
  AppStyles,
  ColorHelper,
  AnalyticsHelper
} from "./../components/common/Index";
import { Reminders } from "../components/Index";

const AnimatedModal = Animated.createAnimatedComponent(Modal);
const AnimatedTouchableHighlight = Animated.createAnimatedComponent(
  TouchableHighlight
);

/*--------------------------------------------------
  Component
----------------------------------------------------*/
class AddItem extends React.Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onItemAddition: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    wereItemsFetched: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      addItemValue: "",
      addItemReminder: "",
      isDisabled: false,
      swipeToClose: true,
      revealReminders: false
    };

    this.checkItemSaved = false;
    this.checkItemChanged = false;
    this.colorChangeAnimationDriver = new Animated.Value(0);
    this.saveFeedbackAnimationDriver = new Animated.Value(0);
    this.revealSaveActionAnimationDriver = new Animated.Value(0);

    // Bind handlers
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleModalVisibility = this.handleModalVisibility.bind(this);
    this.handleBackPress = this.handleBackPress.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAddReminder = this.handleAddReminder.bind(this);
  }

  /*--------------------------------------------------
    Lifecycle events
  ----------------------------------------------------*/
  componentDidMount() {
    // BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateCheck = this.state.addItemValue !== nextState.addItemValue;
    const propCheck =
      this.props.isVisible !== nextProps.isVisible ||
      nextProps.wereItemsFetched === true;
    return stateCheck || propCheck;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.checkItemSaved !== true) return;

    this.startColorChangeAnimation();
    this.startSaveFeedbackAnimation();
    this.animateHideSave();

    this.checkItemSaved = false;
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
    this.setState({ addItemValue: event.nativeEvent.text });

    // Start dependant animations – show tags, save button, etc
    this.showDependantControls(event.nativeEvent.text);
  }

  handleClose() {
    AnalyticsHelper.trackScreen({
      name: "list_item_screen"
    });

    this.props.onClose();
  }

  handleClosingState(state) {
    Keyboard.dismiss();
  }

  handleSave(event) {
    if (this.state.addItemValue === "") return;

    ColorHelper.incrementColors();

    AnalyticsHelper.trackEvent({
      name: "add_item-saved",
      value: this.state.addItemValue
    });

    // Pass state to higher-order component
    this.props.onItemAddition(
      this.state.addItemValue,
      this.state.addItemReminder
    );

    this.animateHideReminders();

    // Set local state
    this.setState({ addItemValue: "", addItemReminder: "" });
    this.checkItemSaved = true;
  }

  handleAddReminder(reminder) {
    this.state.addItemReminder = reminder;
  }

  startColorChangeAnimation() {
    this.colorChangeAnimationDriver.setValue(0);

    Animated.timing(this.colorChangeAnimationDriver, {
      toValue: 100,
      duration: 700,
      delay: 0,
      useNativeDriver: false
    }).start();
  }

  startSaveFeedbackAnimation() {
    this.saveFeedbackAnimationDriver.setValue(0);

    Animated.spring(this.saveFeedbackAnimationDriver, {
      toValue: 0.4,
      duration: 100,
      friction: 6,
      tension: 100,
      delay: 0,
      useNativeDriver: true
    }).start(() => {
      Animated.timing(this.saveFeedbackAnimationDriver, {
        toValue: 0,
        duration: 500,
        delay: 1000,
        useNativeDriver: true
      }).start();
    });
  }

  showDependantControls(value) {
    if (this.checkItemChanged !== true) {
      this.animateRevealReminders();
      this.animateRevealSave();
      this.checkItemChanged = true;
    } else if (value === "") {
      this.animateHideReminders();
      this.animateHideSave({ delay: false });
      this.checkItemChanged = false;
    }
  }

  animateRevealReminders() {
    this.setState({ revealReminders: true });
  }

  animateHideReminders() {
    this.setState({ revealReminders: false });
  }

  animateRevealSave() {
    this.revealSaveActionAnimationDriver.setValue(0);
    Animated.spring(this.revealSaveActionAnimationDriver, {
      toValue: -60,
      duration: 50,
      friction: 8,
      tension: 100,
      delay: 0,
      useNativeDriver: false
    }).start();
  }

  animateHideSave({ delay = true } = {}) {
    const timeoutSecs = delay === true ? 0 : 0;

    setTimeout(() => {
      Animated.spring(this.revealSaveActionAnimationDriver, {
        toValue: 0,
        duration: 50,
        friction: 8,
        tension: 100,
        delay: 0,
        useNativeDriver: false
      }).start();
    }, timeoutSecs);
  }

  getDynamicStylesForAddItemText(text) {
    let textStyle = styles.add_item__text;

    const textLength = text.length;
    if (textLength > 45) {
      textStyle = styles.add_item__text_small;
    } else if (textLength > 30) {
      textStyle = styles.add_item__text_small;
    }

    return textStyle;
  }

  getAnimationStyles() {
    const { currentColor, nextColor } = ColorHelper.getCurrentAndNextColor();
    const currentColorDark = Chroma(currentColor).darken(0.5).css();
    const currentColorDarker = Chroma(currentColor).darken(1.2).css();
    const nextColorDark = Chroma(nextColor).darken(0.5).css();
    const nextColorDarker = Chroma(nextColor).darken(1.2).css();

    const interpolateColor = this.colorChangeAnimationDriver.interpolate({
      inputRange: [0, 100],
      outputRange: [currentColor, nextColor]
    });
    const interpolateColorDark = this.colorChangeAnimationDriver.interpolate({
      inputRange: [0, 100],
      outputRange: [currentColorDark, nextColorDark]
    });
    const interpolateColorDarker = this.colorChangeAnimationDriver.interpolate({
      inputRange: [0, 100],
      outputRange: [currentColorDarker, nextColorDarker]
    });

    const animatedStyle = {
      colors: {
        currentColor,
        currentColorDarker,
        nextColor,
        nextColorDark,
        nextColorDarker
      },
      modal: {
        backgroundColor: interpolateColor
      },
      add_item__title: {
        color: interpolateColorDarker
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

    if (this.props.isVisible === true) {
      AnalyticsHelper.trackScreen({
        name: "add_item_screen"
      });
    }

    return (
      <View style={styles.container}>
        <AnimatedModal
          style={[styles.modal, animatedStyle.modal]}
          isOpen={this.props.isVisible}
          swipeToClose={this.state.swipeToClose}
          swipeThreshold={150}
          onClosed={this.handleClose}
          onClosingState={this.handleClosingState}
          position={"top"}
          backdrop={false}
          backdropOpacity={0.5}
          backButtonClose={false}
          backdropPressToClose={false}
          startOpen
        >
          {this.renderPullDown()}
          {this.renderItemDescription()}
          {this.renderReminders()}
          {this.renderSaveButton()}
          {this.renderSaveFeedbackAnimation()}
        </AnimatedModal>
      </View>
    );
  }

  renderItemDescription() {
    const animatedStyle = this.getAnimationStyles();
    const addItemTextStyle = this.getDynamicStylesForAddItemText(
      this.state.addItemValue
    );

    return (
      <View style={[styles.modal_sub_container]}>
        <KeyboardAvoidingView
          style={styles.add_item__container}
          behavior="padding"
        >
          <Animated.Text
            style={[styles.add_item__title, animatedStyle.add_item__title]}
          >
            Remind me to
          </Animated.Text>

          <TextInput
            style={[styles.add_item__text, addItemTextStyle]}
            value={this.state.addItemValue}
            onChange={this.handleChange}
            onSubmitEditing={this.handleSave}
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
        </KeyboardAvoidingView>
      </View>
    );
  }

  renderSaveButton() {
    const animatedStyle = this.getAnimationStyles();

    return (
      <AnimatedTouchableHighlight
        style={[
          styles.add_item_save__button,
          animatedStyle.add_item_save__button,
          {
            transform: [{ translateY: this.revealSaveActionAnimationDriver }]
          }
        ]}
        onPress={this.handleSave}
        activeOpacity={1}
        underlayColor={"rgba(0, 0, 0, 0.3)"}
      >
        <Text style={styles.add_item_save__title}>Save item</Text>
      </AnimatedTouchableHighlight>
    );
  }

  renderPullDown() {
    return (
      <Image
        source={require("./../../assets/images/pulldown.png")}
        style={styles.pulldown}
      />
    );
  }

  renderReminders() {
    return (
      <Reminders
        style={styles.reminders}
        onAddReminder={this.handleAddReminder}
        revealReminders={this.state.revealReminders}
      />
    );
  }

  renderSaveFeedbackAnimation() {
    return (
      <Animated.Image
        source={require("./../../assets/images/add_item_sucess.gif")}
        style={[
          styles.save_feedback,
          {
            opacity: this.saveFeedbackAnimationDriver,
            transform: [
              {
                translateX: this.saveFeedbackAnimationDriver.interpolate({
                  inputRange: [0, 0.4],
                  outputRange: [-25, -10]
                })
              }
            ]
          }
        ]}
      />
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
    width: "97%"
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: AppStyles.colors.redPrimary,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginTop: 20, // 5
    elevation: 50
  },
  modal_sub_container: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80
  },
  reminders: {
    flex: 0,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  add_item__container: {
    justifyContent: "center",
    alignSelf: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
    paddingHorizontal: 35,
    paddingVertical: 0
  },
  add_item__title: {
    flex: 0,
    color: Chroma(AppStyles.colors.redPrimary).darken(1.5),
    fontSize: 16,
    fontFamily: "Overpass-SemiBold",
    marginBottom: -8,
    padding: 0
  },
  add_item__text: {
    flex: 1,
    margin: 0,
    marginLeft: -6,
    width: 300,
    fontSize: 34, //46,
    fontFamily: "Overpass-Regular",
    color: "white",
    fontWeight: "100",
    textAlignVertical: "top",
    maxHeight: 170
  },
  add_item__text_small: {
    fontSize: 26,
    marginRight: 50
  },
  add_item_save__button: {
    alignSelf: "stretch",
    padding: 18,
    backgroundColor: AppStyles.colors.redSecondary,
    borderColor: "black",
    top: 60
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
  },
  save_feedback: {
    width: 50,
    height: 50,
    opacity: 0,
    alignSelf: "flex-end",
    marginRight: 20,
    marginBottom: -10,
    position: "absolute"
  },
  pulldown: {
    alignSelf: "center",
    marginTop: 18,
    opacity: 0.8
  }
});

/*--------------------------------------------------
    Exports
----------------------------------------------------*/
export { AddItem };
