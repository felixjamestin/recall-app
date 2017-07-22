import React from "react";
import { ScrollView, StyleSheet, Animated, Easing } from "react-native";
import PropTypes from "prop-types";
import Moment from "moment";
import { Tag } from "./common/Tag";

require("datejs");

/*--------------------------------------------------
  Component
----------------------------------------------------*/
class Reminders extends React.PureComponent {
  static propTypes = {
    onAddReminder: PropTypes.func.isRequired,
    revealReminders: PropTypes.bool.isRequired
  };

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

    this.times = [
      { id: this.reminderEnum.NO_REMINDER, desc: "No reminder" },
      { id: this.reminderEnum.ONE_HR_LATER, desc: "1 hour later" },
      { id: this.reminderEnum.TWO_HR_LATER, desc: "2 hours later" },
      { id: this.reminderEnum.TOM_MORNING, desc: "Tomorrow morning" },
      { id: this.reminderEnum.SAT_MORNING, desc: "Saturday morning" },
      { id: this.reminderEnum.MON_MORNING, desc: "Monday morning" }
    ];

    this.state = {
      selected: 0,
      revealReminders: false
    };

    this.setupRevealRemindersAnimation();

    this.handleTagSelection = this.handleTagSelection.bind(this);
  }

  /*--------------------------------------------------
    Lifecycle events
  ----------------------------------------------------*/
  componentWillReceiveProps(nextProps) {
    this.setState({ revealReminders: nextProps.revealReminders });
    if (nextProps.revealReminders === false) this.setState({ selected: 0 });
  }

  componentDidUpdate(prevProps, prevState) {
    this.toggleRevealRemindersAnimation();
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  handleTagSelection(id) {
    const selectedTagIndex = this.times.findIndex(tag => {
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

  setupRevealRemindersAnimation() {
    // Setup drivers
    this.revealTagsAnimationDrivers = this.times.map((value, index) => {
      return new Animated.Value(0);
    });

    // Setup animations
    this.revealTagsAnimations = this.revealTagsAnimationDrivers.map(
      (value, index) => {
        return Animated.timing(this.revealTagsAnimationDrivers[index], {
          toValue: 1,
          duration: 200,
          easing: Easing.in,
          useNativeDriver: true
        });
      }
    );
  }

  resetRemindersAnimation() {
    this.revealTagsAnimationDrivers.forEach(value => {
      value.setValue(0);
    });
  }

  toggleRevealRemindersAnimation() {
    this.props.revealReminders === true
      ? Animated.stagger(120, this.revealTagsAnimations).start()
      : this.resetRemindersAnimation();
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    if (this.state.revealReminders === false) return null;

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        horizontal
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="none"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {this.times.map((item, index) =>
          <Tag
            key={item.id}
            id={item.id}
            text={item.desc}
            value={item.value}
            selected={index === this.state.selected}
            onSelect={this.handleTagSelection}
            animationDriver={this.revealTagsAnimationDrivers[index]}
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
  Exports
----------------------------------------------------*/
export { Reminders };
