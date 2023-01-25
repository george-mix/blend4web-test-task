import { BaseElement } from "../BaseElement";
import "./ModalForm";

const initialState = {
  title: "Добавление цвета",
};

export class ColorModal extends BaseElement {
  #props;
  #state = initialState;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set props(value) {
    this.#props = value;

    if (this.props.status === "new") {
      this.#state.title = "Добавление цвета";
    }

    if (this.props.status === "update") {
      this.#state.title = "Редактировать цвет";
    }

    this.render();
    this.drillState();
    this.listenClickOutside();
    this.listenForm();
  }

  get props() {
    return this.#props;
  }

  drillState() {
    const form = this.shadowRoot.querySelector("modal-form");
    form.props = this.props;
  }

  listenClickOutside() {
    const container = this.shadowRoot.querySelector(".container");
    const modal = container.querySelector(".modal");
    container.addEventListener("click", (e) => {
      if (!modal.contains(e.target)) {
        this.close();
      }
    });
  }

  listenForm() {
    const modal = this.shadowRoot.querySelector("modal-form");
    modal.addEventListener("closemodal", () => {
      this.close();
    });
  }

  get state() {
    return this.#state;
  }

  createStyle() {
    return `
      :host { 
        position: absolute;
        top: 0;
        width: 100vw;
        height: 100vh;
      }

      .container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--filler);
      }

      .modal {
        width: 320px;
        background-color: var(--background-primary);
        border-radius: 20px;
      }

      .title {
        text-align: center;
        font-weight: 600;
        font-size: 18px;
        margin-top: 20px;
        margin-bottom: 27px;
      }
    `;
  }

  close() {
    this.shadowRoot.innerHTML = ``;
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.css}

      <div class="container">
        <div class="modal">
          <h2 class="title">${this.state.title}</h2>
          <modal-form></modal-form>
        </div>
      </div>
    `;
  }
}

customElements.define("color-modal", ColorModal);
