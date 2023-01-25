import "./main.css";
import "./components/ColorTable";
import "./components/ColorModal";
import { BaseElement } from "./components/BaseElement";
import { ColorService } from "./services/ColorService";

class AppRoot extends BaseElement {
  constructor() {
    super();

    const colorService = new ColorService();
    colorService.loadColorArray();

    this.render();
  }

  connectedCallback() {
    const table = this.querySelector("color-table");
    table.addEventListener("openmoodal", (e) => {
      const modal = this.querySelector("color-modal");
      modal.props = e.detail;
    });
  }

  createStyle() {
    return `
      :host {
        position: realtive;
      }

      .container {
        display: flex;
        justify-content: center;
        padding: 30px;
      }

      .container--absolute {
        
      }
    `;
  }

  render() {
    this.innerHTML = `
      ${this.css}
      <div class="container">
        <color-table></color-table>
      </div>
      
        <color-modal></color-modal>
    
    `;
  }
}

customElements.define("app-root", AppRoot);
