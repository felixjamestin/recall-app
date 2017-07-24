import { AppStyles } from "./Index";

class ColorHelper {
  static bgColorIndex = 0;
  static saveCounter = 0; // Used to update color upon saving items

  static setColorIndex(newIndex) {
    ColorHelper.bgColorIndex = newIndex;
  }

  static incrementColors() {
    if (ColorHelper.saveCounter >= 1) {
      ColorHelper.bgColorIndex++;
    }
    ColorHelper.saveCounter++;
  }

  static getCurrentAndNextColor() {
    const colorKeys = Object.keys(AppStyles.rowColors);
    const currentColorIndex = ColorHelper.bgColorIndex % colorKeys.length;
    const currentColor = AppStyles.rowColors[colorKeys[currentColorIndex]];
    const nextColorIndex = (ColorHelper.bgColorIndex + 1) % colorKeys.length;
    const nextColor = AppStyles.rowColors[colorKeys[nextColorIndex]];
    return {
      currentColor,
      nextColor
    };
  }

  static getColorForRow({ incrementColors = true } = {}) {
    const color = ColorHelper.getCurrentAndNextColor().currentColor;

    if (incrementColors) ColorHelper.bgColorIndex++;

    return color;
  }

  static getRandomColor() {
    const colorKeys = Object.keys(AppStyles.rowColors);
    const colorIndex = ColorHelper.bgColorIndex % colorKeys.length;
    ColorHelper.bgColorIndex++;
    return AppStyles.rowColors[colorKeys[colorIndex]];
  }
}

export { ColorHelper };
