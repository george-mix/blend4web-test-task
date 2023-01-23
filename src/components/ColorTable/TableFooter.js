import { ColorService } from "../../services/ColorService";
import { BaseElement } from "../BaseElement";

export class TableFooter extends BaseElement {
  constructor() {
    super();
    this.render();
  }

  connectedCallback() {
    const colorService = new ColorService();

    const createButton = this.querySelector(".button");
    createButton.addEventListener("click", (e) => {
      colorService.addItemToColorArray();
    });
  }

  createStyle() {
    return `
      .button {
        border: 1px solid var(--primary);
        padding: 10px 68px;
        border-radius: 20px;
        background-color: var(--background-color);
        color: var(--text-primary);
        cursor: pointer;
      }
    `;
  }

  render() {
    this.innerHTML = `
      ${this.css}
      <button class="button">Добавить цвет</button>
    `;
  }
}

customElements.define("table-footer", TableFooter);
