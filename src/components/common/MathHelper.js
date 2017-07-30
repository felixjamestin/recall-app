class MathHelper {
  static getRandomIntInclusive(min, max) {
    const minInt = Math.ceil(min);
    const maxInt = Math.floor(max);
    return Math.floor(Math.random() * (maxInt - minInt + 1)) + min;
  }
}

export { MathHelper };
