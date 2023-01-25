import { ColorService } from "../../services/ColorService";
import { BaseElement } from "../BaseElement";
import "./ColorPicker";
import "./FormSelect";

export class ModalForm extends BaseElement {
  #props;
  #state = {
    placeholder: "Введите название",
    selectedOption: "main",
    colorName: "",
    colorValue: "#2D1E1E",
  };

  constructor() {
    super();
  }

  set props(value) {
    this.#props = value;
    if (this.props.status === "update") {
      const colorService = new ColorService();
      const colorObject = colorService.colorArray[this.props.colorObjectIndex];
      this.#state.placeholder = colorObject.name;
      this.#state.selectedOption = colorObject.type;
      this.#state.colorName = colorObject.name;
      this.#state.colorValue = colorObject.color;
    }
    this.render();
    this.drillState();
    this.watchForm();
  }

  drillState() {
    const select = this.querySelector("form-select");
    select.props = this.#state.selectedOption;
    const picker = this.querySelector("color-picker");
    picker.props = this.#state.colorValue;
  }

  watchForm() {
    const form = this.querySelector(".form");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = [...new FormData(form)];

      const colorItem = {
        color: "",
        name: "",
        type: "",
      };
      formData.forEach((data) => {
        const propertyName = data[0];
        if (propertyName === "color-name") {
          colorItem.name = data[1];
        }
        if (propertyName === "color-type") {
          colorItem.type = data[1];
        }
        if (propertyName === "color-picker") {
          colorItem.color = data[1];
        }
      });

      const colorService = new ColorService();
      if (this.props.status === "update") {
        colorService.updateItemFromColorArray(
          this.props.colorObjectIndex,
          colorItem
        );
      }
      if (this.props.status === "new") {
        colorService.addItemToColorArray(colorItem);
      }

      const closeEvent = new CustomEvent("closemodal", {
        bubbles: true,
      });
      this.dispatchEvent(closeEvent);
    });
  }

  get props() {
    return this.#props;
  }

  get state() {
    return this.#state;
  }

  createStyle() {
    return `
      .form__inputs {
        padding-left: 15px;
        padding-right: 25px;
        margin-bottom: 32px;
      }

      .form-field {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .form-field__form-label {
        font-weight: 700;
        font-size: 12px;
        color: var(--text-dark-grey);
      }

      .form-field__field {
        width: 175px;
        background-color: var(--cell-color);
        height: 40px;
        border: 1px solid var(--light-grey);
        border-radius: 6px;
        padding-left: 15px;
        color: var(--text-secondary);
      }

      .form-field--spacing {
        margin-bottom: 17px;
      }

      .form-field__form-input::placeholder {
        color: var(--text-secondary);
        font-size: 12px;
        font-weight: 400;
      }

      .form__button {
        display: block;
        padding: 10px 100px;
        background-color: var(--primary);
        border-radius: 100px;
        border: none;
        margin: 18px auto 14px auto;
        color: var(--text-primary);
        cursor: pointer;
      }
    `;
  }

  render() {
    this.innerHTML = `
      ${this.css}

      <form class="form">
        <div class="form__inputs">
          <div class="form-field form-field--spacing">
            <label class="form-field__form-label" for="color-name">
              Название цвета
            </label>
            <input 
              class="form-field__field form-field__form-input" 
              id="color-name" 
              name="color-name" 
              type="text" 
              required
              placeholder="${this.state.placeholder}" 
              value="${this.#state.colorName}"
            />
          </div>

          <div class="form-field form-field--spacing">
            <label class="form-field__form-label" for="color-name">
              Выберите тип
            </label>
            
            <form-select name="color-type" id="color-type"></form-select>
          </div>
        </div>

        <color-picker name="color-picker" id="color-picker"></color-picker>

        <button class="form__button" type="submit">
          Добавить
        </button>
      </form>
    `;
  }
}

customElements.define("modal-form", ModalForm);
