import React from "react";
import { ScrollView, StyleSheet, Animated, Easing } from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import PropTypes from "prop-types";
import Moment from "moment";
import { Tag } from "./common/Tag";

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

    this.state = {
      selected: 0,
      revealReminders: false,
      isDateTimePickerVisible: false
    };

    this.timesEnum = {
      NO_REMINDER: 0,
      CUSTOM: 1,
      ONE_HR_LATER: 2,
      TWO_HR_LATER: 3,
      THREE_HR_LATER: 4,
      TOM_MORNING: 5,
      SAT_MORNING: 6,
      MON_MORNING: 7
    };

    this.timesDesc = [
      { id: this.timesEnum.NO_REMINDER, desc: "No reminder" },
      { id: this.timesEnum.CUSTOM, desc: "Custom" },
      { id: this.timesEnum.ONE_HR_LATER, desc: "1 hour later" },
      { id: this.timesEnum.TWO_HR_LATER, desc: "2 hours later" },
      { id: this.timesEnum.THREE_HR_LATER, desc: "3 hours later" },
      { id: this.timesEnum.TOM_MORNING, desc: "Tomorrow 8AM" },
      { id: this.timesEnum.SAT_MORNING, desc: "Saturday 8AM" },
      { id: this.timesEnum.MON_MORNING, desc: "Monday 8AM" }
    ];

    this.setupRevealRemindersAnimation();

    this.handleTagSelection = this.handleTagSelection.bind(this);
    this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
    this.handleDatePicked = this.handleDatePicked.bind(this);
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
    const selectedTagIndex = this.timesDesc.findIndex(tag => {
      return tag.id === id;
    });

    this.setState({
      selected: selectedTagIndex,
      isDateTimePickerVisible: false
    });

    if (selectedTagIndex !== this.timesEnum.CUSTOM) {
      this.handlePresetPicked(id);
    } else {
      this.showDateTimePicker();
    }
  }

  showDateTimePicker() {
    this.setState({ isDateTimePickerVisible: true });
  }

  hideDateTimePicker() {
    this.setState({ isDateTimePickerVisible: false });
    this.handleTagSelection(this.timesEnum.NO_REMINDER);
  }

  handlePresetPicked(id) {
    const reminderDate = this.convertTagToDate(id);
    this.props.onAddReminder(reminderDate);
  }

  handleDatePicked(date) {
    const reminderDate = Moment(date);
    this.props.onAddReminder(reminderDate);
    this.setState({ isDateTimePickerVisible: false });
  }

  convertTagToDate(id) {
    if (id === this.timesEnum.NO_REMINDER) {
      return "";
    } else if (id === this.timesEnum.ONE_HR_LATER) {
      return Moment().add(1, "h");
    } else if (id === this.timesEnum.TWO_HR_LATER) {
      return Moment().add(2, "h");
    } else if (id === this.timesEnum.THREE_HR_LATER) {
      return Moment().add(3, "h");
    } else if (id === this.timesEnum.TOM_MORNING) {
      return Moment().add(1, "d").hours(8).minutes(0).seconds(0);
    } else if (id === this.timesEnum.SAT_MORNING) {
      return this.getNextISODayOfWeek(6).hours(8).minutes(0).seconds(0);
    } else if (id === this.timesEnum.MON_MORNING) {
      return this.getNextISODayOfWeek(1).hours(8).minutes(0).seconds(0);
    }
  }

  getNextISODayOfWeek(dayOfWeek) {
    const today = Moment().isoWeekday();
    const day =
      today <= dayOfWeek
        ? Moment().isoWeekday(dayOfWeek)
        : Moment().add(1, "weeks").isoWeekday(dayOfWeek);
    return day;
  }

  setupRevealRemindersAnimation() {
    // Setup drivers
    this.revealTagsAnimationDrivers = this.timesDesc.map((value, index) => {
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
        {this.timesDesc.map((item, index) =>
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
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          mode="datetime"
          is24Hour={false}
        />
      </ScrollView>
    );
  }
}

/*--------------------------------------------------
  Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28
  }
});

/*--------------------------------------------------
  Exports
----------------------------------------------------*/
export { Reminders };
