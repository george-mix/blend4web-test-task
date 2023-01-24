import { LocalStorage } from "./LocalStorage";

const LS_LIST_KEY = "color-list";

export class ColorService {
  static #inst;
  #colorArray = [
    { name: "Мятное утро", type: "main", color: "#86EAE9" },
    { name: "Лавандовый пунш", type: "base", color: "#B8B2DD" },
    { name: "Лавандовый пунш", type: "main", color: "#37C9EF" },
  ];
  #subscribers = [];

  constructor() {
    if (!ColorService.#inst) {
      ColorService.#inst = this;
    }

    return ColorService.#inst;
  }

  get colorArray() {
    return this.#colorArray;
  }

  set colorArray(array) {
    this.#colorArray.splice(0, this.#colorArray.length);
    array.forEach((item) => this.#colorArray.push(item));
    this.notifySubscribers();
  }

  subscribeForUpdates(cb) {
    this.#subscribers.push(cb);

    return () => {
      this.#subscribers = this.#subscribers.filter((c) => c !== cb);
    };
  }

  notifySubscribers() {
    this.#subscribers.forEach((sub) => sub());
  }

  addItemToColorArray(item) {
    this.#colorArray.push({
      name: item.name,
      type: item.type,
      color: item.color,
    });
    this.notifySubscribers();
  }

  deleteItemFromCollorArray(index) {
    this.#colorArray.splice(index, 1);
    this.notifySubscribers();
  }

  updateItemFromColorArray(index, newItem) {
    this.#colorArray[index] = newItem;
    this.notifySubscribers();
  }

  saveColorArray() {
    LocalStorage.setItem(LS_LIST_KEY, JSON.stringify(this.colorArray));
  }

  loadColorArray() {
    const arrayInStorage = LocalStorage.getItem(LS_LIST_KEY);
    if (arrayInStorage) {
      this.colorArray = JSON.parse(arrayInStorage);
    }
  }
}
