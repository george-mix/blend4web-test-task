import { BaseElement } from "../BaseElement";

export class TableFooter extends BaseElement {
  constructor() {
    super();
    this.render();
  }

  connectedCallback() {
    const createButton = this.querySelector(".button");
    createButton.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("openmoodal", {
          detail: {
            status: "new",
          },
          bubbles: true,
          composed: true,
        })
      );
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

      @media screen and (max-width: 500px) {
        .button {
          padding: 10px 34px;
        }
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
