import React from "react";
import { View, TouchableHighlight, Image, StyleSheet } from "react-native";

const addItemsButton = props => (
  <View style={styles.show_add_item__container}>
    <TouchableHighlight
      activeOpacity={0.85}
      underlayColor="transparent"
      onPress={() => {
        props.onShowAddItem(true);
      }}
    >
      <Image
        style={styles.show_add_item__button}
        source={require("./../../assets/images/add_item_button.png")}
      />
    </TouchableHighlight>
  </View>
);

const styles = StyleSheet.create({
  show_add_item__container: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  show_add_item__button: {
    bottom: 0,
    paddingTop: 20,
    marginBottom: 10
  }
});

export default addItemsButton;
