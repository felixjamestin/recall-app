import React from "react";
import { DeviceEventEmitter } from "react-native";
import PushNotification from "react-native-push-notification";

class PushController extends React.PureComponent {
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
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: token => {
        console.log("TOKEN:", token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: notification => {
        console.log("NOTIFICATION:", notification);
      },

      // ANDROID ONLY: GCM Sender ID (optional for local notifications, but required for remote ones)
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

      /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
      requestPermissions: true
    });
  }

  handlePushActions() {
    PushNotification.registerNotificationActions([
      "Snooze: 1 hr",
      "Snooze: 6 hrs",
      "Snooze: Tomorrow"
    ]);

    DeviceEventEmitter.addListener("notificationActionReceived", action => {
      console.log("Notification action received: " + action);

      const info = JSON.parse(action.dataJSON);
      if (info.action === "Snooze: 1 hr") {
        alert("Holaaaa");
      } else if (info.action === "Snooze: 6 hrs") {
      } else if (info.action === "Snooze: Tomorrow") {
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
