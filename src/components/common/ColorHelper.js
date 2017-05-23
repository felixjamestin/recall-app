import { AppStyles } from "./Index";

export class ColorHelper {
  static bgColorIndex = 0;

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

  static getColorForRow() {
    const color = ColorHelper.getCurrentAndNextColor().currentColor;
    ColorHelper.bgColorIndex++;
    return color;
  }

  static getRandomColor() {
    const colorKeys = Object.keys(AppStyles.rowColors);
    const colorIndex = ColorHelper.bgColorIndex % colorKeys.length;
    ColorHelper.bgColorIndex++;
    return AppStyles.rowColors[colorKeys[colorIndex]];
  }
}
