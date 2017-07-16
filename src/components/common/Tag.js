import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import Touchable from "react-native-platform-touchable";

/*--------------------------------------------------
  Component
----------------------------------------------------*/
class Tag extends React.PureComponent {
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
        <Touchable
          onPress={this.handleTagSelection}
          style={[
            styles.tag_body,
            this.props.selected && styles.tag_body_selected
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
        </Touchable>
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
    fontSize: 15,
    fontFamily: "Overpass-SemiBold",
    color: "rgba(255, 255, 255, .4)"
  },
  tag_text_selected: {
    color: "rgba(255, 255, 255, .8)"
  }
});

/*--------------------------------------------------
  Props
----------------------------------------------------*/
Tag.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired
};

/*--------------------------------------------------
  Exports
----------------------------------------------------*/
export { Tag };
