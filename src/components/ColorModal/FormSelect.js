import { BaseElement } from "../BaseElement";
import arrowDown from "../../assets/icons/arrow-down.svg";

const options = ["main", "primary", "secondary", "base"];

export class FormSelect extends BaseElement {
  #props;
  #value = "main";
  static formAssociated = true;

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.attachShadow({ mode: "open" });
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }
    this.internals.setFormValue(this.#value);
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value;
    this.internals.setFormValue(this.#value);
    this.render();
    this.listenSelect();
  }

  get form() {
    return this.internals.form;
  }

  get name() {
    return this.getAttribute("name");
  }

  get type() {
    return this.localName;
  }

  set props(value) {
    this.#value = value;

    this.render();
    this.listenSelect();
  }

  get props() {
    return this.#props;
  }

  listenSelect() {
    const selected = this.shadowRoot.querySelector(".selected");
    const optionsContainer =
      this.shadowRoot.querySelector(".options-container");
    const optionsList = this.shadowRoot.querySelectorAll(".option");

    selected.addEventListener("click", () => {
      optionsContainer.classList.toggle("active");
    });

    optionsList.forEach((option) => {
      option.addEventListener("click", () => {
        this.value = option.querySelector("label").innerHTML;
        optionsContainer.classList.remove("active");
      });
    });
  }

  createStyle() {
    return `
      .select-box {
        display: flex;
        width: 175px;
        flex-direction: column;
        position: relative;
      }

      .select-box .options-container {
        background: #424242;
        color: var(--text-secondary);
        font-size: 12px;
        font-weight: 400;
        max-height: 0;
        width: 100%;
        opacity: 0;
        border-radius: 6px;
        border: 1px solid var(--light-grey);
        overflow: hidden;
      
        order: 1;
      }

      .selected {
        color: var(--text-secondary);
        font-size: 12px;
        font-weight: 400;
        position: relative;
        background-color: var(--cell-color);
        height: 40px;
        border: 1px solid var(--light-grey);
        border-radius: 6px;
        color: var(--text-secondary);
      
        order: 0;
      }

      .selected::after {
        content: "";
        background: url("${arrowDown}");
        background-size: contain;
        background-repeat: no-repeat;
        position: absolute;
        height: 25px;
        width: 25px;
        right: 10px;
        top: 10px;
        transform: scale(0.5);
      }
      
      .select-box .options-container.active {
        position: absolute;
        top: 0;
        max-height: 400px;
        opacity: 1;
        overflow-y: auto;
        z-index: 10;
      }
      
      .select-box .options-container.active + .selected::after {
        opacity: 0;
      }
      
      .select-box .selected {
        padding-left: 15px;
        cursor: pointer;
        display: flex;
        align-items: center;
      }

      .select-box .selected span {
        vertical-align: center;
      }

      .select-box .option {
        padding: 12px;
        cursor: pointer;
        color: var(--text-dim);
      }

      .select-box .option:hover label {
        cursor: pointer;  
      }

      .select-box .option:hover {
        background: var(--background-hover); 
        color: var(--light-grey-text);
      }

      .select-box .option .radio {
        display: none;
      }
    `;
  }

  renderSelectOptions() {
    return `
      ${options
        .map((option) => {
          return `
            <div class="option">
              <input
                type="radio"
                class="radio"
                id="${option}"
                name="${option}"
              />
              <label for="${option}">${option}</label>
            </div>
          `;
        })
        .join("")}
    `;
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.css}

      <div class="select-box">
        <div class="options-container">
          ${this.renderSelectOptions()}
        </div>
        
        <div class="selected">
          <span>${this.value}</span>
        </div>
      </div>
    `;
  }
}

customElements.define("form-select", FormSelect);
