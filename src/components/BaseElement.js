export class BaseElement extends HTMLElement {
  constructor() {
    super();
  }

  createStyle() {
    return "";
  }

  get css() {
    const styles = this.createStyle();

    return `
      <style>
        *,
        *::after,
        *::before {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :host {
          display: block;
        }

        ${styles && styles}
      </style>
    `;
  }
}
