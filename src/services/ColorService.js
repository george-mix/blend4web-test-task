export class ColorService {
  static #inst;
  #colorArray = [
    { name: "Лавандовый пунш", type: "main", color: "#86EAE9" },
    { name: "Лавандовый пунш", type: "side", color: "#B8B2DD" },
    { name: "Лавандовый пунш", type: "main", color: "#86EAE9" },
  ];
  #subscribers = new Set();

  constructor() {
    if (!ColorService.#inst) {
      ColorService.#inst = this;
    }

    return ColorService.#inst;
  }

  get getColorArray() {
    return this.#colorArray;
  }

  subscribeForUpdates(cb) {
    this.#subscribers.add(cb);

    return () => {
      this.#subscribers = this.#subscribers.delete(cb);
    };
  }

  notifySubscribers() {
    this.#subscribers.forEach((sub) => sub());
  }

  addItemToColorArray() {
    this.#colorArray.push({ name: "name3", type: "side", color: "#f8f8f8" });
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
}
