import React from "react";
import { DeviceEventEmitter } from "react-native";
import PushNotification from "react-native-push-notification";
import Moment from "moment";
import { MathHelper } from "../components/common/MathHelper";

class PushController extends React.PureComponent {
  static pushActionEnum = {
    dismiss: "DISMISS",
    snooze1hr: "SNOOZE 1HR",
    snoozetillnextmorning: "TILL TOMM 8AM"
  };

  static triggerPushNotifications({ value, reminder } = {}) {
    if (reminder === "") return; // reminderDate = new Date(Date.now() + 0 * 1000);

    const reminderDate = reminder.toDate();
    const id = MathHelper.getRandomIntInclusive(1, 100000000);

    PushNotification.localNotificationSchedule({
      id,
      title: "Recall",
      message: value,
      date: reminderDate,
      autoCancel: false,
      largeIcon: "ic_launcher",
      smallIcon: "ic_launcher", //"ic_notification",
      actions: `['${PushController.pushActionEnum.dismiss}','${PushController
        .pushActionEnum.snooze1hr}','${PushController.pushActionEnum
        .snoozetillnextmorning}']`
    });

    return id;
  }

  static cancelPushNotification({ reminderID } = {}) {
    PushNotification.cancelLocalNotifications({ id: reminderID });
  }

  /*--------------------------------------------------
    Lifecycle events
  ----------------------------------------------------*/
  componentWillMount() {
    this.handlePushActions();
  }

  componentDidMount() {
    this.configurePushNotifications();
  }

  /*--------------------------------------------------
  Helpers & Handlers
  ----------------------------------------------------*/
  configurePushNotifications() {
    PushNotification.configure({
      // Opt: Called when Token is generated (iOS and Android)
      onRegister: token => {
        console.log("TOKEN:", token);
      },

      // Called when a remote or local notification is opened or received
      onNotification: notification => {
        console.log("NOTIFICATION:", notification);
      },

      // ANDROID ONLY: GCM Sender ID (optional for local notifications, required for remote ones)
      senderID: "YOUR GCM SENDER ID",

      // IOS ONLY (optional): default: all - Permissions to register
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      //
      // Opt: default: true
      // - Specified if permissions (ios) and token (android and ios) will requested or not,
      // - if not, you must call PushNotificationsHandler.requestPermissions() later
      //
      requestPermissions: true
    });
  }

  handlePushActions() {
    PushNotification.registerNotificationActions([
      PushController.pushActionEnum.dismiss,
      PushController.pushActionEnum.snooze1hr,
      PushController.pushActionEnum.snoozetillnextmorning
    ]);

    DeviceEventEmitter.addListener("notificationActionReceived", action => {
      const info = JSON.parse(action.dataJSON);
      if (info.action === PushController.pushActionEnum.dismiss) {
        // Do nothing
      } else if (info.action === PushController.pushActionEnum.snooze1hr) {
        PushController.triggerPushNotifications({
          value: info.message,
          reminder: Moment().add(1, "h")
        });
      } else if (
        info.action === PushController.pushActionEnum.snoozetillnextmorning
      ) {
        PushController.triggerPushNotifications({
          value: info.message,
          reminder: Moment().add(1, "d").hours(8).minutes(0).seconds(0)
        });
      }
    });
  }

  /*--------------------------------------------------
  Render UI
  ----------------------------------------------------*/
  render() {
    return null;
  }
}

/*--------------------------------------------------
  Exports
----------------------------------------------------*/
export { PushController };
