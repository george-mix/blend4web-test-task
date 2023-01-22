import "./main.css";

class AppRoot extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.innerHTML = `
       
    `;
  }
}

customElements.define("app-root", AppRoot);
