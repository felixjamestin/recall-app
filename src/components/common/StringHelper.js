class StringHelper {
  static getRandomStringFromArray(strings = []) {
    const randomIndex = Math.floor(Math.random() * strings.length);
    return strings[randomIndex];
  }

  static getNextStringInArray(strings = [], currentIndex) {
    const nextIndex = (currentIndex + 1) % strings.length;
    return {
      placeholderText: strings[nextIndex],
      placeholderIndex: nextIndex
    };
  }
}

export { StringHelper };
