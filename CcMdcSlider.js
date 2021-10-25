class CcMdcSlider extends HTMLElement {
  constructor() {
    super();
    this._disabled = false;
    this._value = 0;
    this._min = 0;
    this._max = 100;
    this._step = 1;
  }

  connectedCallback() {
    var label = this.getAttribute("label") || "Label";
    if (this.hasAttribute("value")) {
      this._value = this.getAttribute("value");
    }
    this._disabled = this.getAttribute("disabled") ? true : false;

    this.innerHTML = `<div class="mdc-slider mdc-slider--discrete" tabindex="0" role="slider" aria-valuemin="${this._min}" aria-valuemax="${this._max}" aria-valuestep="${this._step}" aria-valuenow="${this._value}" aria-label="${label}">
  <div class="mdc-slider__track-container">
    <div class="mdc-slider__track" style="transform: scaleX(0.1);"></div>
  </div>
  <div class="mdc-slider__thumb-container" style="transform: translateX(77.9px) translateX(-50%);">
    <div class="mdc-slider__pin">
      <span class="mdc-slider__pin-value-marker">${this._value}</span>
    </div>
    <svg class="mdc-slider__thumb" width="21" height="21">
      <circle cx="10.5" cy="10.5" r="7.875"></circle>
    </svg>
    <div class="mdc-slider__focus-ring"></div>
  </div>
</div>
`;

    this.rootElement = this.childNodes[0];
    this.mdcComponent = mdc.slider.MDCSlider.attachTo(this.rootElement);
    this.indicator = this.querySelector(".mdc-slider__value-indicator-text");

    this.mdcComponent.step = this.getAttribute("step") || this._step;
    this.mdcComponent.max = this.getAttribute("max") || this._max;
    this.mdcComponent.min = this.getAttribute("min") || this._min;
    this.applyValue();
    this.applyDisabled();
  }

  set disabled (value) {
    this._disabled = value;
    this.applyDisabled();
  }

  applyDisabled() {
    if (this.rootElement) {
      if (this._disabled) {
        this.rootElement.className = "mdc-slider mdc-slider--disabled";
      } else {
        this.rootElement.className = "mdc-slider mdc-slider--discrete";
      }
    }
  }

  set value (value) {
    this._value = value;
    this.applyValue();
  }

  set min (value) {
    this._min = value;
    if (this.mdcComponent) {
      this.mdcComponent.min = this._min;
    }
  }

  set max (value) {
    this._max = value;
    if (this.mdcComponent) {
      this.mdcComponent.max = this._max;
    }
  }

  set step (value) {
    this._step = value;
    if (this.mdcComponent) {
      this.mdcComponent.step = this._step;
    }
  }

  get value () {
    if (this.mdcComponent) {
      return this.mdcComponent.value;
    }
    return this._value;
  }

  applyValue() {
    if (this.mdcComponent && isDefined(this._value)) {
      this.mdcComponent.value = (this._value);
      this.mdcComponent.min = this._min;
      this.mdcComponent.max = this._max;
    }
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
  }
}

window.customElements.define("cc-mdc-slider", CcMdcSlider);

