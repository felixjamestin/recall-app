import { ColorHelper } from "./common/Index";

class ItemFactory {
  static createItem(
    { value, reminder = "", incrementColors = false, color = "" } = {}
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
      selected: false,
      delete: false,
      createdAt: new Date(),
      bgColor,
      contentType: "text"
    };
  }
}

export { ItemFactory };
