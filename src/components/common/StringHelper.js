class StringHelper {
  static getRandomPlaceholder(placeholders = []) {
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    return placeholders[randomIndex];
  }
}

export { StringHelper };
