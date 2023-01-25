import { BaseElement } from "../BaseElement";
import "./TableHeader";
import "./DataTable";
import "./TableFooter";

export class ColorTable extends BaseElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  createStyle() {
    return `
      :host {
        max-width: 680px;
        background-color: var(--background-primary);
        color: var(--text-primary);
        border-radius: 20px;
        align-self: start;
      }

      .table-footer {
        display: flex;
        padding: 30px 0 32px 0;
        justify-content: center;
        align-items: center;
      }

      @media screen and (max-width: 500px) {
        :host {
          max-width: 400px;
          min-width: 150px;
          padding: 20px;
          overflox-x: scroll;
        }
      }
    `;
  }

  render() {
    this.shadowRoot.innerHTML = `
        ${this.css}
        <table-header></table-header>
        <data-table></data-table>
        <table-footer class="table-footer"></table-footer>
    `;
  }
}

customElements.define("color-table", ColorTable);
