import React from "react";
import { Text, StyleSheet, Image, View } from "react-native";
import PropTypes from "prop-types";
import Moment from "moment";

class RowRowReminderText extends React.PureComponent {
  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    const reminder = Moment(this.props.reminderDate).isAfter()
      ? Moment(this.props.reminderDate).calendar().toUpperCase()
      : "EXPIRED REMINDER";

    if (this.props.reminderDate.toString() === "") {
      return null;
    }

    return (
      <View style={styles.item_reminder_container}>
        <Image
          style={styles.item_reminder_icon}
          source={require("./../../assets/images/reminder_icon.png")}
        />
        <Text style={styles.item_reminder_text}>
          {reminder}
        </Text>
      </View>
    );
  }
}

/*--------------------------------------------------
    Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  item_reminder_container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    opacity: 0.7
  },
  item_reminder_icon: {
    marginRight: 3,
    marginTop: 2
  },
  item_reminder_text: {
    fontFamily: "Overpass-SemiBold",
    fontSize: 12,
    color: "white"
  }
});

/*--------------------------------------------------
  Props
----------------------------------------------------*/
RowReminderText.propTypes = {
  reminderDate: PropTypes.object.isRequired
};

/*--------------------------------------------------
  Exports
----------------------------------------------------*/
export { RowReminderText };
