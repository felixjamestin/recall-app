import React from "react";
import { Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

class RowTitleText extends React.PureComponent {
  constructor(props) {
    super(props);

    // Bind Handlers
    this.getDynamicStylesForTitle = this.getDynamicStylesForTitle.bind(this);
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  getDynamicStylesForTitle(text) {
    let titleStyle = styles.item_title_large;

    const textLength = text.length;
    if (textLength > 55) {
      titleStyle = styles.item_title_small;
    } else if (textLength > 40) {
      titleStyle = styles.item_title_medium;
    }

    return titleStyle;
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <Text
        style={[
          styles.item_title_base,
          this.getDynamicStylesForTitle(this.props.text)
        ]}
      >
        {this.props.text}
      </Text>
    );
  }
}

/*--------------------------------------------------
    Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  item_title_base: {
    fontFamily: "Overpass-Regular",
    color: "white",
    paddingBottom: 20
  },
  item_title_large: {
    fontSize: 22,
    lineHeight: 36
  },
  item_title_medium: {
    fontSize: 16,
    lineHeight: 28,
    paddingRight: 20
  },
  item_title_small: {
    fontSize: 16,
    lineHeight: 28,
    paddingRight: 20
  }
});

/*--------------------------------------------------
  Props
----------------------------------------------------*/
RowTitleText.propTypes = {
  text: PropTypes.string.isRequired
};

/*--------------------------------------------------
  Exports
----------------------------------------------------*/
export { RowTitleText };
