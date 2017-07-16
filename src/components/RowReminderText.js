import React from "react";
import { Text, StyleSheet, Image, View } from "react-native";
import PropTypes from "prop-types";
import Moment from "moment";

class RowReminderText extends React.PureComponent {
  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    const reminder = Moment(this.props.reminderDate).calendar().toUpperCase();
    const isReminderValid = Moment(this.props.reminderDate).isAfter();
    const isReminderExpired = isReminderValid ? false : true;

    // const reminder = Moment(this.props.reminderDate).isAfter()
    //   ? Moment(this.props.reminderDate).calendar().toUpperCase()
    //   : "EXPIRED REMINDER";

    if (this.props.reminderDate.toString() === "") {
      return null;
    }

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
    paddingBottom: 10,
    top: -7
  },
  item_reminder_icon: {
    marginRight: 3,
    marginTop: 2,
    opacity: 0.9
  },
  item_reminder_text: {
    fontFamily: "Overpass-SemiBold",
    fontSize: 12,
    color: "white",
    opacity: 0.7
  },
  item_reminder_icon_expired: {
    opacity: 0.5
  },
  item_reminder_text_expired: {
    opacity: 0.4
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
