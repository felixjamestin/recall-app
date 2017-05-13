import React from "react";
import {
  View,
  Text,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  BackHandler,
  Vibration
} from "react-native";
import Modal from "react-native-modalbox";
import Toast from "react-native-easy-toast";
import AppStyles from "./../components/common/AppStyles";

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

    // Bind handlers
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleEndEditing = this.handleEndEditing.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleModalVisibility = this.handleModalVisibility.bind(this);
    this.handleBackPress = this.handleBackPress.bind(this);
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

  handleSave(event) {
    // Pass state to higher-order component
    this.props.onItemAddition(this.state.addItemValue);

    // Feedback
    Vibration.vibrate();
    this.refs.toast.show("Saved!");

    // Set local state
    this.setState({ addItemValue: "" });
  }

  handleClose() {
    console.log("Modal just closed");
  }

  handleOpen() {
    console.log("Modal just opened Felix");
  }

  handleClosingState(state) {
    console.log("Open/close of the swipeToClose just changed");
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <View style={styles.container}>

        <Modal
          style={styles.modal}
          isOpen={this.state.isModalVisible}
          swipeToClose={this.state.swipeToClose}
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
            {/*
              <TouchableHighlight
              style={styles.hide__container}
              activeOpacity={1}
              underlayColor="transparent"
              onPress={() => {
                this.handleModalVisibility(!this.state.isModalVisible);
              }}
            >
              <Text style={styles.hide__text}>Pull to see items</Text>
            </TouchableHighlight>
            */}

            <View style={styles.add_item__container}>
              <Text style={styles.add_item__title}>
                Remind me to
              </Text>

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

          <TouchableHighlight
            style={styles.add_item_save__button}
            onPress={this.handleSave}
            activeOpacity={1}
            underlayColor={AppStyles.colors.redSecondaryDark}
          >
            <Text style={styles.add_item_save__title}>Save</Text>
          </TouchableHighlight>

        </Modal>

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
  hide__container: {
    flex: 1.1,
    alignSelf: "center",
    marginTop: 0
  },
  hide__text: {
    color: AppStyles.colors.redText,
    fontSize: 9,
    fontFamily: "Overpass-SemiBold"
  },
  add_item__container: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap"
  },
  add_item__title: {
    flex: 0,
    color: AppStyles.colors.redText,
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
    backgroundColor: AppStyles.colors.redPrimary,
    alignSelf: "flex-start",
    marginLeft: 25,
    paddingRight: 60
  },
  toast_text: {
    color: AppStyles.colors.redText,
    fontSize: 16
  }
});

/*--------------------------------------------------
    Exports
----------------------------------------------------*/
export { AddItem };
