import { DeviceEventEmitter } from "react-native";
import PushNotification from "react-native-push-notification";
import Moment from "moment";
import { isNil } from "lodash";
import { MathHelper } from "../components/common/MathHelper";

class PushService {
  static pushActionEnum = {
    dismiss: "DISMISS",
    snooze1hr: "SNOOZE 1HR",
    snoozetillnextmorning: "TILL TOMM 8AM"
  };

  static init() {
    PushService.onNotification = notification => {
      if (!isNil(notification.subject) && notification.subject !== "") {
        PushNotification.localNotification({
          title: notification.subject,
          message: notification.body
        });
      }
    };
    PushService.onRegistration = null;
    PushService.tab = null;
  }

  static triggerPushNotifications({ value, reminder } = {}) {
    if (reminder === "") return;

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
      soundName: "default",
      vibrate: true,
      vibration: 500,
      group: "Recall",
      ongoing: true,
      number: id,
      actions: `['${PushService.pushActionEnum.dismiss}','${PushService
        .pushActionEnum.snooze1hr}','${PushService.pushActionEnum
          .snoozetillnextmorning}']`
    });

    return id;
  }

  static cancelPushNotification({ reminderID } = {}) {
    PushNotification.cancelLocalNotifications({ id: reminderID });
  }

  static configurePushNotifications() {
    PushNotification.configure({
      onRegister: token => {
        if (PushService.onRegistration) {
          PushService.onRegistration(token);
        }
      },

      onNotification: notification => {
        if (PushService.onNotification) {
          PushService.onNotification(notification);
        }
      },

      senderID: "YOUR GCM SENDER ID", // ANDROID ONLY: GCM Sender ID

      // IOS ONLY (optional): default: all
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically?
      popInitialNotification: true,

      // Opt: default: true. Specified if permissions (ios) and token (android and ios) will requested or not, if not, you must call PushNotificationsHandler.requestPermissions() later
      requestPermissions: true
    });
  }

  static setCallbacks(onRegistration, onNotification) {
    PushService.onRegistration = onRegistration;
    PushService.onNotification = onNotification;
  }

  static handlePushActions() {
    PushNotification.registerNotificationActions([
      PushService.pushActionEnum.dismiss,
      PushService.pushActionEnum.snooze1hr,
      PushService.pushActionEnum.snoozetillnextmorning
    ]);

    DeviceEventEmitter.addListener("notificationActionReceived", action => {
      const info = JSON.parse(action.dataJSON);

      const dismiss = PushService.pushActionEnum.dismiss;
      const snooze1hr = PushService.pushActionEnum.snooze1hr;
      const snoozemorning = PushService.pushActionEnum.snoozetillnextmorning;

      // prettier-ignore
      if (info.action === dismiss) {
      } else if (info.action === snooze1hr) {
        PushService.triggerPushNotifications({ value: info.message, reminder: Moment().add(1, "h") });
      } else if (info.action === snoozemorning) {
        PushService.triggerPushNotifications({ value: info.message, reminder: Moment().add(1, "d").hours(8).minutes(0).seconds(0) });
      }
    });
  }
}

PushService.init();

/*--------------------------------------------------
  Exports
----------------------------------------------------*/
export { PushService };
