import ColorHelper from "./../components/common/ColorHelper";

export default class Item {
  constructor(value, contentType = "text") {
    this.key = Date.now();
    this.value = value;
    this.creationTimestamp = new Date();
    this.bgColor = ColorHelper.getColorForRow();
    this.contentType = contentType;
    this.alarms = [];
  }

  // TODO: Getters & Setters
}
