import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

/*--------------------------------------------------
  Component
----------------------------------------------------*/
class AnimatedTick extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>AnimatedTick</Text>
      </View>
    );
  }
}

/*--------------------------------------------------
  Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50"
  }
});

/*--------------------------------------------------
  Exports
----------------------------------------------------*/
export default AnimatedTick;
