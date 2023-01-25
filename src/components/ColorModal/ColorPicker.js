import tinycolor from "tinycolor2";
import { BaseElement } from "../BaseElement";

const defaultSwatches = [
  "#D0021B",
  "#F5A623",
  "#F8E71C",
  "#8B572A",
  "#7ED321",
  "#417505",
  "#BD10E0",
  "#9013FE",
  "#4A90E2",
  "#B8E986",
  "#000000",
  "#9B9B9B",
  "#FFFFFF",
];

export class ColorPicker extends BaseElement {
  #value = "";
  #props;

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

  set props(value) {
    this.value = value;
    this.#props = value;

    this.render();
    this.start();
  }

  get props() {
    return this.#props;
  }

  start() {
    const swatches = this.shadowRoot.querySelector(".default-swatches");
    const colorIndicator = this.shadowRoot.querySelector(".color-indicator");

    const hexField = this.shadowRoot.querySelector(".hex-field");

    const spectrumCanvas = this.shadowRoot.querySelector(".spectrum-canvas");
    const spectrumCtx = spectrumCanvas.getContext("2d");
    const spectrumCursor = this.shadowRoot.querySelector(".spectrum-cursor");
    let spectrumRect = spectrumCanvas.getBoundingClientRect();

    const hueCanvas = this.shadowRoot.querySelector(".hue-canvas");
    const hueCtx = hueCanvas.getContext("2d");
    const hueCursor = this.shadowRoot.querySelector(".hue-cursor");
    let hueRect = hueCanvas.getBoundingClientRect();

    const red = this.shadowRoot.querySelector(".red");
    const blue = this.shadowRoot.querySelector(".blue");
    const green = this.shadowRoot.querySelector(".green");
    const hex = this.shadowRoot.querySelector(".hex");

    let currentColor = tinycolor(this.value);
    let hue = 0;
    let saturation = 1;
    let lightness = 0.5;

    const placeColorToValue = (setValue) => (color) => {
      if (typeof color === "string" && color.includes("hsl")) {
        setValue(tinycolor(color).toHexString());
      } else {
        setValue(color.toHexString());
      }
    };
    const rememberSetter = placeColorToValue(this.setValue.bind(this));

    colorToPos(currentColor);
    addDefaultSwatches();
    createShadeSpectrum();
    createHueSpectrum();

    function createShadeSpectrum(color = "#f00") {
      const canvas = spectrumCanvas;
      const ctx = spectrumCtx;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const whiteGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      whiteGradient.addColorStop(0, "#fff");
      whiteGradient.addColorStop(1, "transparent");
      ctx.fillStyle = whiteGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const blackGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      blackGradient.addColorStop(0, "transparent");
      blackGradient.addColorStop(1, "#000");
      ctx.fillStyle = blackGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      canvas.addEventListener("mousedown", function (e) {
        startGetSpectrumColor(e);
      });
    }

    function createHueSpectrum() {
      const canvas = hueCanvas;
      const ctx = hueCtx;
      const hueGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      hueGradient.addColorStop(0.0, "hsl(0, 100%, 50%)");
      hueGradient.addColorStop(0.17, "hsl(298.8, 100%, 50%)");
      hueGradient.addColorStop(0.33, "hsl(241.2, 100%, 50%)");
      hueGradient.addColorStop(0.5, "hsl(180, 100%, 50%)");
      hueGradient.addColorStop(0.67, "hsl(118.8, 100%, 50%)");
      hueGradient.addColorStop(0.83, "hsl(61.2, 100%, 50%)");
      hueGradient.addColorStop(1.0, "hsl(360, 100%, 50%)");
      ctx.fillStyle = hueGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      canvas.addEventListener("mousedown", function (e) {
        startGetHueColor(e);
      });
    }

    function addDefaultSwatches() {
      defaultSwatches.forEach((swatch) => {
        createSwatch(swatches, swatch);
      });
    }

    function createSwatch(target, color) {
      const swatch = document.createElement("button");
      swatch.classList.add("swatch");
      swatch.setAttribute("title", color);
      swatch.style.backgroundColor = color;
      swatch.addEventListener("click", function () {
        const color = tinycolor(this.style.backgroundColor);
        colorToPos(color);
        setColorValues(color);
      });
      target.appendChild(swatch);
      refreshElementRects();
    }

    function refreshElementRects() {
      spectrumRect = spectrumCanvas.getBoundingClientRect();
      hueRect = hueCanvas.getBoundingClientRect();
    }

    function startGetSpectrumColor(e) {
      getSpectrumColor(e);
      spectrumCursor.classList.add("dragging");
      window.addEventListener("mousemove", getSpectrumColor);
      window.addEventListener("mouseup", endGetSpectrumColor);
    }

    function getSpectrumColor(e) {
      e.preventDefault();

      let x = e.pageX - spectrumRect.left;
      let y = e.pageY - spectrumRect.top;

      if (x > spectrumRect.width) {
        x = spectrumRect.width;
      }
      if (x < 0) {
        x = 0;
      }
      if (y > spectrumRect.height) {
        y = spectrumRect.height;
      }
      if (y < 0) {
        y = 0.1;
      }

      const xRatio = (x / spectrumRect.width) * 100;
      const yRatio = (y / spectrumRect.height) * 100;
      const hsvValue = 1 - yRatio / 100;
      const hsvSaturation = xRatio / 100;
      lightness = (hsvValue / 2) * (2 - hsvSaturation);
      saturation =
        (hsvValue * hsvSaturation) / (1 - Math.abs(2 * lightness - 1));
      const color = tinycolor(
        "hsl " + hue + " " + saturation + " " + lightness
      );
      setCurrentColor(color);
      setColorValues(color);
      updateSpectrumCursor(x, y);
    }

    function endGetSpectrumColor(e) {
      spectrumCursor.classList.remove("dragging");
      window.removeEventListener("mousemove", getSpectrumColor);
    }

    function setCurrentColor(color) {
      const colorNew = tinycolor(color);
      currentColor = colorNew;
      colorIndicator.style.backgroundColor = colorNew;
      spectrumCursor.style.backgroundColor = colorNew;
      rememberSetter(color);
      hueCursor.style.backgroundColor =
        "hsl(" + colorNew.toHsl().h + ",100%, 50%)";
    }

    function setColorValues(color) {
      const colorNew = tinycolor(color);
      const rgbValues = colorNew.toRgb();
      const hexValue = colorNew.toHex();

      red.value = rgbValues.r;
      green.value = rgbValues.g;
      blue.value = rgbValues.b;
      hex.value = hexValue;
    }

    function updateSpectrumCursor(x, y) {
      spectrumCursor.style.left = x + "px";
      spectrumCursor.style.top = y + "px";
    }

    function startGetHueColor(e) {
      getHueColor(e);
      hueCursor.classList.add("dragging");
      window.addEventListener("mousemove", getHueColor);
      window.addEventListener("mouseup", endGetHueColor);
    }

    function getHueColor(e) {
      e.preventDefault();
      let y = e.pageY - hueRect.top;
      if (y > hueRect.height) {
        y = hueRect.height;
      }
      if (y < 0) {
        y = 0;
      }
      const percent = y / hueRect.height;
      hue = 360 - 360 * percent;
      const hueColor = tinycolor("hsl " + hue + " 1 .5").toHslString();
      const color = tinycolor(
        "hsl " + hue + " " + saturation + " " + lightness
      ).toHslString();
      createShadeSpectrum(hueColor);
      updateHueCursor(y, hueColor);
      setCurrentColor(color);
      setColorValues(color);
    }

    function updateHueCursor(y) {
      hueCursor.style.top = y + "px";
    }

    function endGetHueColor() {
      hueCursor.classList.remove("dragging");
      window.removeEventListener("mousemove", getHueColor);
    }

    red.addEventListener("change", () => {
      const color = tinycolor(
        "rgb " + red.value + " " + green.value + " " + blue.value
      );
      colorToPos(color);
    });

    green.addEventListener("change", () => {
      const color = tinycolor(
        "rgb " + red.value + " " + green.value + " " + blue.value
      );
      colorToPos(color);
    });

    blue.addEventListener("change", () => {
      const color = tinycolor(
        "rgb " + red.value + " " + green.value + " " + blue.value
      );
      colorToPos(color);
    });

    hexField.addEventListener("change", () => {
      const hexInput = hexField.querySelector("input");
      const color = tinycolor("#" + hexInput.value);
      colorToPos(color);
    });

    function colorToPos(color) {
      const colorNew = tinycolor(color);
      const hsl = colorNew.toHsl();
      hue = hsl.h;
      const hsv = colorNew.toHsv();
      const x = spectrumRect.width * hsv.s;
      const y = spectrumRect.height * (1 - hsv.v);
      const hueY = hueRect.height - (hue / 360) * hueRect.height;
      updateSpectrumCursor(x, y);
      updateHueCursor(hueY);
      setCurrentColor(colorNew);
      setColorValues(colorNew);
      createShadeSpectrum(colorToHue(colorNew));
    }

    function colorToHue(color) {
      const colorNew = tinycolor(color);
      const hueString = tinycolor(
        "hsl " + colorNew.toHsl().h + " 1 .5"
      ).toHslString();
      return hueString;
    }
  }

  setValue(value) {
    this.value = value;
  }

  render() {
    this.shadowRoot.innerHTML = `
      ${this.css}

      <div class="wrapper">
        <div class="color-picker-panel">
          <div class="panel-row">
            <div class="spectrum-map">
              <button class="spectrum-cursor color-cursor"></button>
              <canvas class="spectrum-canvas"></canvas>
            </div>
            <div class="hue-map">
              <button class="hue-cursor color-cursor"></button>
              <canvas class="hue-canvas"></canvas>
            </div>
          </div>
          <div class="panel-row panel-row__color">
            <div class="hex-field field-group value-fields active">
              <span class="hex-field__color-title hex-field--font">Color</span>
              <div class="hex-field__label">
                <label class="field-label hex-field--font" for="hex-input">Hex</label>
              </div>
              <input class="hex field-input" name="hex-input" type="text">
            </div>
            <span class="color-indicator"></span>
          </div>
          <div class="panel-row">
            <div class="rgb-fields field-group value-fields active">
              <div class="field-group">
                <div class="rgb-field">
                  <label for="red" class="field-label">R</label>
                  <input name="red" type="number" max="255" min="0" class="red field-input rgb-input">
                </div>
              </div>
              <div class="field-group">
                <div class="rgb-field">
                  <label for="green" class="field-label">G</label>
                  <input name="green" type="number" max="255" min="0" class="green field-input rgb-input">
                </div>
              </div>
              <div class="field-group">
                <div class="rgb-field">
                  <label for="blue" class="field-label">B</label>
                  <input name="blue" type="number" max="255" min="0" class="blue field-input rgb-input">
                </div>
              </div>
            </div>
          </div>
          
          <div class="panel-row">
            <div class="swatches default-swatches"></div>
          </div>
        </div>
      </div>
    `;
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value;
    this.internals.setFormValue(this.#value);
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

  createStyle() {
    return getCss();
  }
}

customElements.define("color-picker", ColorPicker);

function getCss() {
  return `
  .wrapper {
    position: relative;
  }
  .color-picker-panel {
    background: var(--background-color-picker);
    width: 100%;
    max-width: 255px;
    border-radius: 8px;
    border: 1px solid var(--border-color-picker);
    position: relative;
    margin: auto;
    padding: 7px 5px;
  }
  .panel-row {
    position: relative;
  }
  .panel-row__color {
    display: flex;
    padding-top: 7px;
    padding-bottom: 8px;
  }
  .hex-field--font {
    color: var(--text-dim);
    font-size: 12px;
    font-weight: 400;
  }
  .hex-field__color-title {
    margin: 0 10px;
  }
  .hex-field__label {
    width: 68px;
    padding-right: 7px; 
    border: 1px solid var(--border-color-picker);
    border-radius: 2px;
    padding-left: 8px;
  }
  .swatch {
    display: inline-block;
    width:  20px;
    height: 20px;
    background: #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    border: none;
    cursor: pointer;
  }
  .default-swatches {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, 20px);
    padding-left: 10px;
    row-gap: 10px;
    column-gap: 15px;
    margin-bottom: 11px;
    margin-top: 20px;
  }
  .color-cursor {
    border-radius: 100%;
    background: var(--filler);
    box-sizing: border-box;
    position: absolute;
    pointer-events: none;
    z-index: 2;
    border: 1px solid var(--border-color-picker);
    transition: all 0.2s ease;
  }
  .color-cursor.dragging {
    transition: none;
  }
  .color-cursor.spectrum-cursor {
    width: 30px;
    height: 30px;
    margin-left: - 15px;
    margin-top: - 15px;
    top: 0;
    left: 0;
  }
  .color-cursor.hue-cursor {
    top: 0;
    left: 50%;
    height: 20px;
    width: 20px;
    margin-top: -10px;
    margin-left: -10px;
    pointer-events: none;
  }
  .spectrum-map {
    position: relative;
    width: 215px;
    height: 220px;
    overflow: hidden;
    border: 1px solid var(--border-color-picker);
  }
  .spectrum-canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ccc;
  }
  .hue-map {
    position: absolute;
    top: 0;
    bottom: 5px;
    right: 0;
    width: 25px;
    height: 220px;
    filter: brightness(70%);
    border: 1px solid var(--border-color-picker);
    border-radius: 1px;
  }
  .hue-canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: #ccc;
  }
  .value-fields {
    display: none;
    align-items: center;
  }
  .value-fields.active {
    display: flex;
  }
  .value-fields .field-input {
    background: var(--cell-color);
    border: 1px solid var(--light-grey);
    box-sizing: border-box;
    border-radius: 2px;
    line-height: 25px;
    color: var(--text-dim);
    font-size: 12px;
    font-weight: 400;
    display: block;
  }
  .rgb-fields.field-group {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }
  .value-fields .rgb-input {
    border: none;
    outline: none;
    line-height: 20px;
    min-width: 20px;
    background-color: var(--dark-grey);
  }
  .rgb-field {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border: 1px solid var(--border-color-picker);
    color: var(--text-primary);
    font-size: 11px;
    height: 23px;
    width: 70px;
    border-radius: 2px;
    padding: 0 10px;
    gap: 20px;
    background-color: var(--dark-grey);
  }
  .hex-field .field-input {
    width: 90px;
    margin-left: 7px;
    padding: 8px;
    height: 25px;
  }
  .color-indicator {
    display: block;
    margin-left: 5px;
    width: 25px;
    height: 25px;
    border-radius: 3px;
    background: #ccc;
  }
  input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  `;
}
