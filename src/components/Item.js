import React from "react";
import ColorHelper from "./common/Index";

export class Item {
  constructor(value) {
    this.key = Date.now();
    this.value = value;
    this.creationTimestamp = new Date();
    this.bgColor = ColorHelper.getColorForRow();
    this.contentType = "text";
    this.alarms = [];
  }

  // TODO: Getters & Setters
}
