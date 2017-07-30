import React, { Component } from "react";
import { StyleSheet, Animated } from "react-native";
import PropTypes from "prop-types";
import Animation from "lottie-react-native";

/*--------------------------------------------------
  Component
----------------------------------------------------*/
class AnimatedTick extends Component {
  static propTypes = {
    showAnimation: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.animationDriver = new Animated.Value(0);
  }

  /*--------------------------------------------------
    Lifecycle events
  ----------------------------------------------------*/
  componentDidUpdate(prevProps, prevState) {
    if (this.props.showAnimation !== true) return;
    this.startAnimation();
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  startAnimation() {
    this.animationDriver.setValue(0);
    Animated.timing(this.animationDriver, {
      toValue: 1,
      duration: 5000
    }).start();
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <Animation
        style={styles.animation}
        source="soda_loader.json"
        progress={this.saveFeedbackAnimationDriver}
      />
    );
  }
}

/*--------------------------------------------------
  Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  animation: {
    width: 50,
    height: 50,
    opacity: 1
  }
});

/*--------------------------------------------------
  Exports
----------------------------------------------------*/
export default AnimatedTick;
