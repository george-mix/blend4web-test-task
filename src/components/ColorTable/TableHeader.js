import { BaseElement } from "../BaseElement";
import saveButton from "../../assets/icons/save-button.svg";
import closeButton from "../../assets/icons/close-button.svg";
import { ColorService } from "../../services/ColorService";

export class TableHeader extends BaseElement {
  constructor() {
    super();
    this.render();

    const colorService = new ColorService();
    const saveButtonEl = this.querySelector(".table-header__save-button");
    const saveButtonImg = saveButtonEl.querySelector("img");
    saveButtonImg.src = saveButton;
    saveButtonEl.addEventListener("click", () => {
      colorService.saveColorArray();
    });

    const closeButtonEl = this.querySelector(".table-header__close-button");
    const closeButtonImg = closeButtonEl.querySelector("img");
    closeButtonImg.src = closeButton;
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

      .table-header__controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
      }
      
      .table-header__button {
        background: transparent;
        border: none;
        cursor: pointer;
        width: 25px;
        height: 25px;
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
          <button class="table-header__button table-header__save-button">
            <img>
          </button>
          <button class="table-header__button table-header__close-button">
            <img>
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define("table-header", TableHeader);
