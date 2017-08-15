import React from "react";
import { Text, StyleSheet, Image, View } from "react-native";
import PropTypes from "prop-types";
import Moment from "moment";

class RowReminderText extends React.PureComponent {
  static propTypes = {
    reminderDate: PropTypes.object.isRequired
  };

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    const isReminderValid = Moment(this.props.reminderDate).isAfter();
    const isReminderExpired = !isReminderValid;

    const reminder = Moment(this.props.reminderDate).calendar().toUpperCase();
    const reminderTextWithDetails = isReminderValid
      ? reminder
      : `${reminder} (EXPIRED)`;

    if (this.props.reminderDate.toString() === "") return null;

    return (
      <View style={styles.item_reminder_container}>
        <Image
          style={[
            styles.item_reminder_icon,
            isReminderExpired && styles.item_reminder_icon_expired
          ]}
          source={require("./../../assets/images/reminder_icon.png")}
        />
        <Text
          style={[
            styles.item_reminder_text,
            isReminderExpired && styles.item_reminder_text_expired
          ]}
        >
          {reminderTextWithDetails}
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
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingBottom: 10,
    top: -6
  },
  item_reminder_icon: {
    width: 10,
    height: 10,
    marginRight: 3,
    marginTop: 2,
    opacity: 0.8
  },
  item_reminder_text: {
    fontFamily: "Overpass-SemiBold",
    fontSize: 10,
    color: "white",
    opacity: 0.7
  },
  item_reminder_icon_expired: {
    opacity: 0.4
  },
  item_reminder_text_expired: {
    opacity: 0.3
  }
});

/*--------------------------------------------------
  Exports
----------------------------------------------------*/
export { RowReminderText };
