import Analytics from "analytics-react-native";
import DeviceInfo from "react-native-device-info";

export class AnalyticsHelper {
  static tracker;

  static getTracker() {
    const tracker =
      typeof AnalyticsHelper.tracker !== "undefined"
        ? AnalyticsHelper.tracker
        : new Analytics("eBKRXNvJYOijzVT1nEtGuF980JMNqQJv");
    return tracker;
  }

  static initialize() {
    AnalyticsHelper.getTracker().identify({
      userId: DeviceInfo.getUniqueID(),
      traits: {
        deviceManufacturer: DeviceInfo.getManufacturer(),
        deviceModel: DeviceInfo.getModel(),
        systemName: DeviceInfo.getSystemName(),
        systemVersion: DeviceInfo.getSystemVersion()
      }
    });
  }

  static trackEvent({ name, ...properties }) {
    AnalyticsHelper.getTracker().track({
      userId: DeviceInfo.getUniqueID(),
      event: name,
      properties
    });
  }

  static trackScreen({ name, ...properties }) {
    AnalyticsHelper.getTracker().screen({
      userId: DeviceInfo.getUniqueID(),
      name,
      properties
    });
  }
}
