const prefix = "color_";

export class LocalStorage {
  static getItem(key) {
    return localStorage.getItem(`${prefix}${key}`);
  }

  static setItem(key, value) {
    localStorage.setItem(`${prefix}${key}`, value);
  }
}
