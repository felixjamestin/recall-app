import { ColorHelper } from "./common/Index";

class ItemFactory {
  static createItem(
    {
      value,
      reminder = "",
      reminderID,
      incrementColors = false,
      color = ""
    } = {}
  ) {
    const bgColor =
      color === ""
        ? ColorHelper.getColorForRow({
            incrementColors
          })
        : color;

    return {
      key: Date.now(),
      value,
      reminder,
      reminderID,
      selected: false,
      delete: false,
      createdAt: new Date(),
      bgColor,
      contentType: "text"
    };
  }
}

export { ItemFactory };
