import { BaseElement } from "../BaseElement";

export class TableHeader extends BaseElement {
  constructor() {
    super();
    this.render();
  }

  createStyle() {
    return `
      .table-header {
        display: flex;
        padding: 20px 16px;
      }
    
      .table-header__title {
        font-size: 18px;
        font-weight: 600;
        margin: 0 auto;
      }
    `;
  }

  render() {
    this.innerHTML = `
      ${this.css}
      <div class="table-header">
        <div class="table-header__title">
          <span>Таблица цветов</span>
        </div>
        <div class="table-header__controls">
          <button class="table-header__save-button">Save</button>
          <button class="table-header__close-button">Close</button>
        </div>
      </div>
    `;
  }
}

customElements.define("table-header", TableHeader);
