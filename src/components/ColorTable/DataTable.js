import { DragAndDrop } from "../../helpers/DragAndDrop";
import { ColorService } from "../../services/ColorService";
import { BaseElement } from "../BaseElement";
import deleteButton from "../../assets/icons/delete-button.svg";
import editButton from "../../assets/icons/edit-button.svg";

export class DataTable extends BaseElement {
  #colors = [];
  #unsubscribe = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const colorService = new ColorService();
    const unsubscribe = colorService.subscribeForUpdates(
      this.render.bind(this)
    );
    this.#unsubscribe.push(unsubscribe);
    this.#colors = colorService.colorArray;
    this.render();

    this.handleDragAndDrop();
    const unsubForDnD = colorService.subscribeForUpdates(
      this.handleDragAndDrop.bind(this)
    );
    this.#unsubscribe.push(unsubForDnD);

    this.handleButtonClicks(colorService);
  }

  disconnectedCallback() {
    this.#unsubscribe.forEach((subscription) => subscription());
  }

  handleDragAndDrop() {
    const draggables = this.shadowRoot.querySelectorAll(".draggable");
    const container = this.shadowRoot.querySelector(".table-body");

    const className = "dragging";
    DragAndDrop.handleDrag(
      draggables,
      className,
      this.handleDragEnd.bind(this)
    );
    DragAndDrop.handleDragOver(container, className);
  }

  handleDragEnd() {
    const draggables = this.shadowRoot.querySelectorAll(".draggable");

    const newColorArray = [...draggables].map((draggable) => {
      const color = draggable.querySelector(".table-cell__color").innerText;
      const type = draggable.querySelector(".table-cell__type").innerText;
      const name = draggable.querySelector(".table-cell__color-name").innerText;

      return {
        color,
        type,
        name,
      };
    });

    const colorService = new ColorService();
    colorService.colorArray = newColorArray;
  }

  handleButtonClicks(colorService) {
    this.listenForDeletes(colorService);
    this.listenForUpdates(colorService);

    const unsubForDelete = colorService.subscribeForUpdates(
      this.listenForDeletes.bind(this, colorService)
    );
    const unsubForUpdate = colorService.subscribeForUpdates(
      this.listenForUpdates.bind(this, colorService)
    );

    this.#unsubscribe.push(unsubForDelete);
    this.#unsubscribe.push(unsubForUpdate);
  }

  listenForUpdates() {
    const updateButtons = this.shadowRoot.querySelectorAll(
      ".table-cell__button--update"
    );
    updateButtons.forEach((button, index) => {
      const editButtonImg = button.querySelector("img");
      editButtonImg.src = editButton;

      button.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("openmoodal", {
            detail: {
              status: "update",
              colorObjectIndex: index,
            },
            bubbles: true,
            composed: true,
          })
        );
      });
    });
  }

  listenForDeletes(colorService) {
    const deleteButtons = this.shadowRoot.querySelectorAll(
      ".table-cell__button--delete"
    );
    deleteButtons.forEach((button, index) => {
      const deleteButtonImg = button.querySelector("img");
      deleteButtonImg.src = deleteButton;

      button.addEventListener("click", () => {
        colorService.deleteItemFromCollorArray(index);
      });
    });
  }

  createStyle() {
    return `
      .table {
        background-color: var(--gap-color);
        width: 100%;
        border-collapse: separate;
        border-spacing: 1px;
      }

      .table-cell {
        background-color: var(--cell-color);
        height: 54px;
        padding-left: 16px;
        text-align: left;
      }

      .table-cell--header {
        font-weight: 600;
      }
    
      .table-cell--equal {
        width: 115px;
      }

      .table-cell--content {
        font-weight: 400;
        font-size: 11px;
        color: var(--text-secondary);
      }

      .table-cell__color-rect {
        width: 90px;
       }

      .table-cell__rect {
        margin-left: auto;
        margin-right: auto;
        width: 41px;
        height: 41px;
      }

      .draggable {
        cursor: move;
      }

      .dragging {
        opacity: 0.5;
      }

      .table-cell--center {
        text-align: center;
        padding: 0;
      }

      .table-cell__button {
        background: transparent;
        border: none;
        cursor: pointer;
        width: 20px;
        height: 20px;
      }

      .table-cell__button--update:hover img {
        filter: invert(73%) sepia(31%) saturate(2285%) hue-rotate(166deg) brightness(105%) contrast(89%);
      }

      .table-cell__button--delete:hover img {
        filter: invert(37%) sepia(53%) saturate(735%) hue-rotate(312deg) brightness(97%) contrast(91%);
      }

      .table-cell__text-wrap {
        width: 70%;
      }

      .table-wrapper {
        overflow-x: auto;
      } 

      .table-cell__color-name {
        width: 135px;
      }
    `;
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.css} 

      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th class="table-cell table-cell--header table-cell__color-rect" scope="col">Цвет</th>
              <th class="table-cell table-cell--header table-cell__color-name" scope="col">
                Название
              </th>
              <th class="table-cell table-cell--header table-cell--equal" scope="col">Тип</th>
              <th class="table-cell table-cell--header table-cell--equal" scope="col">Код</th>
              <th class="table-cell table-cell--header table-cell--equal" scope="col">Изменить</th>
              <th class="table-cell table-cell--header table-cell--equal" scope="col">Удалить</th>
            </tr>
          <thead>
      
          <tbody class="table-body">
            ${this.rows}
          </tbody>
        </table>
      </div>
    `;
  }

  get rows() {
    return `${this.#colors
      .map((color) => {
        return ` 
          <tr class="draggable" draggable="true">
            <td class="table-cell table-cell--center">
              <div class="table-cell__rect" style="background-color:${color.color};"></div>
            </td>
            <td class="table-cell table-cell--content table-cell__color-name">
              <div class="table-cell__text-wrap">
                ${color.name}
              </div>
            </td>
            <td class="table-cell table-cell--content table-cell__type">
              ${color.type}
            </td>
            <td class="table-cell table-cell--content table-cell__color">${color.color}</td>
            <td class="table-cell table-cell--center">
              <button class="table-cell__button table-cell__button--update">
                <img>
              </button>
            </td>
            <td class="table-cell table-cell--center">
              <button class="table-cell__button table-cell__button--delete">
                <img>
              </button>
            </td>
          </tr>
        `;
      })
      .join("")}
    `;
  }
}

customElements.define("data-table", DataTable);
