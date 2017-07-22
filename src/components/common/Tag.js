import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import PropTypes from "prop-types";
import Touchable from "react-native-platform-touchable";

const AnimatedTouchable = Animated.createAnimatedComponent(Touchable);

/*--------------------------------------------------
  Component
----------------------------------------------------*/
class Tag extends React.PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    selected: PropTypes.bool,
    onSelect: PropTypes.func.isRequired,
    animationDriver: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    //Bind handlers
    this.handleTagSelection = this.handleTagSelection.bind(this);
  }

  /*--------------------------------------------------
      Helpers & Handlers
  ----------------------------------------------------*/
  handleTagSelection() {
    this.props.onSelect(this.props.id);
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <View key={this.props.id} style={styles.container}>
        <AnimatedTouchable
          onPress={this.handleTagSelection}
          style={[
            styles.tag_body,
            this.props.selected && styles.tag_body_selected,
            { opacity: this.props.animationDriver }
          ]}
        >
          <Text
            style={[
              styles.tag_text,
              this.props.selected && styles.tag_text_selected
            ]}
          >
            {this.props.text}
          </Text>
        </AnimatedTouchable>
      </View>
    );
  }
}

/*--------------------------------------------------
  Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
    marginHorizontal: 0,
    marginLeft: -6
  },
  tag_body: {
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 13
  },
  tag_body_selected: {
    borderRadius: 100,
    opacity: 1
  },
  tag_text: {
    fontSize: 16,
    fontFamily: "Overpass-SemiBold",
    color: "rgba(255, 255, 255, .4)"
  },
  tag_text_selected: {
    color: "rgba(255, 255, 255, .8)"
  }
});

/*--------------------------------------------------
  Exports
----------------------------------------------------*/
export { Tag };
