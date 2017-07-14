import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import Moment from "moment";
import { Tag } from "./common/Tag";

require("datejs");

/*--------------------------------------------------
  Component
----------------------------------------------------*/
class Reminders extends React.PureComponent {
  constructor(props) {
    super(props);

    this.reminderEnum = {
      NO_REMINDER: 0,
      ONE_HR_LATER: 1,
      TWO_HR_LATER: 2,
      TOM_MORNING: 3,
      SAT_MORNING: 4,
      MON_MORNING: 5
    };

    this.state = {
      selected: 0,
      times: [
        { id: this.reminderEnum.NO_REMINDER, desc: "No reminder" },
        { id: this.reminderEnum.ONE_HR_LATER, desc: "1 hour later" },
        { id: this.reminderEnum.TWO_HR_LATER, desc: "2 hours later" },
        { id: this.reminderEnum.TOM_MORNING, desc: "Tomorrow morning" },
        { id: this.reminderEnum.SAT_MORNING, desc: "Saturday morning" },
        { id: this.reminderEnum.MON_MORNING, desc: "Monday morning" }
      ]
    };

    this.handleTagSelection = this.handleTagSelection.bind(this);
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  handleTagSelection(id) {
    const selectedTagIndex = this.state.times.findIndex(tag => {
      return tag.id === id;
    });

    this.setState({
      selected: selectedTagIndex
    });

    const reminderDate = this.convertTagToDate(id);
    this.props.onAddReminder(reminderDate);
  }

  convertTagToDate(id) {
    if (id === this.reminderEnum.NO_REMINDER) {
      return "";
    } else if (id === this.reminderEnum.ONE_HR_LATER) {
      return Moment().add(1, "h");
    } else if (id === this.reminderEnum.TWO_HR_LATER) {
      return Moment().add(2, "h");
    } else if (id === this.reminderEnum.TOM_MORNING) {
      return Date.parse("tomorrow").addHours(8); //TODO: Reduce to only use momentjs
    } else if (id === this.reminderEnum.SAT_MORNING) {
      return Date.parse("next saturday").addHours(8);
    } else if (id === this.reminderEnum.MON_MORNING) {
      return Date.parse("next monday").addHours(8);
    }
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        horizontal
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="none"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {this.state.times.map((item, index) =>
          <Tag
            key={item.id}
            id={item.id}
            text={item.desc}
            value={item.value}
            selected={index === this.state.selected}
            onSelect={this.handleTagSelection}
          />
        )}
      </ScrollView>
    );
  }
}

/*--------------------------------------------------
  Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: { paddingHorizontal: 28 }
});

/*--------------------------------------------------
  Props
----------------------------------------------------*/
Reminders.propTypes = {
  onAddReminder: PropTypes.func.isRequired
};

/*--------------------------------------------------
  Exports
----------------------------------------------------*/
export { Reminders };
