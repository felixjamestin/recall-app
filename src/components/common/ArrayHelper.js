export class ArrayHelper {
  static removeUsingIndex(array, arrayIndex) {
    const arrayIndexInt = parseInt(arrayIndex, 10);

    // Delete from array: Method 1
    return array.filter((item, index) => index !== arrayIndexInt);

    // Delete from array: Method 2
    // const newArray = array.slice();
    // return newArray.splice(arrayIndex, 1);
  }
}
