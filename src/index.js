import "./main.css";
import "./components/ColorTable";
import "./components/ColorModal";
import { BaseElement } from "./components/BaseElement";

class AppRoot extends BaseElement {
  constructor() {
    super();
    this.render();
  }

  createStyle() {
    return `
      .layout {
        display: flex;
        justify-content: center;
        padding: 30px;
        gap: 30px;
      }
    `;
  }

  render() {
    this.innerHTML = `
      ${this.css}
      <div class="layout">
        <color-table></color-table>
       
      </div>
    `;
  }
}

customElements.define("app-root", AppRoot);
