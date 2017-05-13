import React from "react";
import { StackNavigator } from "react-navigation";
import { Items, ReminderOptions } from "./../screens/Index";

const Root = StackNavigator(
  {
    Items: {
      screen: Items
    },
    ReminderOptionsScreen: {
      screen: ReminderOptions
    }
  },
  {
    initialRouteName: "Items",
    mode: "modal",
    headerMode: "none"
  }
);

export { Root };
