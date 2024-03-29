class CcMdcSlider extends HTMLElement {
  constructor() {
    super();
    this._disabled = false;
    this._value = 0;
    this._min = 0;
    this._max = 100;
    this._step = 1;

    const resizeObserver = new ResizeObserver((entries) => {
      this.resizehandler();
    });
    resizeObserver.observe(this);
  }

  connectedCallback() {
    var label = this.getAttribute("label") || "Label";
    if (this.hasAttribute("value")) {
      this._value = this.getAttribute("value");
    }
    this._disabled = this.getAttribute("disabled") ? true : false;

    this.innerHTML = html`<div class="mdc-slider mdc-slider--discrete mdc-slider--display-markers" tabindex="0" role="slider" aria-valuemin="${this._min}" aria-valuemax="${this._max}" aria-valuenow="${this._value}" data-step="${this._step}" aria-label="${label}">
        <div class="mdc-slider__track-container">
          <div class="mdc-slider__track"></div>
          <div class="mdc-slider__track-marker-container"></div>
        </div>
        <div class="mdc-slider__thumb-container">
          <div class="mdc-slider__pin">
            <span class="mdc-slider__pin-value-marker"></span>
            <span class="mdc-slider__pin-value-marker marker1" style="display:none;"></span>
          </div>
          <svg class="mdc-slider__thumb" width="21" height="21">
            <circle cx="10.5" cy="10.5" r="7.875"></circle>
          </svg>
          <div class="mdc-slider__focus-ring"></div>
        </div>
      </div>`;

    var s = this.querySelector(".mdc-slider");
    s.style.height = (this.offsetHeight - 2) + "px";

    var c = this.querySelector(".mdc-slider__thumb-container");
    c.style.top = (14 + parseInt((s.offsetHeight - 48) / 2)) + "px";

    this.rootElement = this.childNodes[0];
    this.mdcComponent = mdc.slider.MDCSlider.attachTo(this.rootElement);
    //this.indicator = this.querySelector(".mdc-slider__value-indicator-text");

/*
    this.mdcComponent.step = this.getAttribute("step") || this._step;
    this.mdcComponent.max = this.getAttribute("max") || this._max;
    this.mdcComponent.min = this.getAttribute("min") || this._min;
*/
    this.rootElement.addEventListener("MDCSlider:change", (e) => {
      var origmarker = this.querySelector(".mdc-slider__pin-value-marker")
      var custommarker = this.querySelector(".marker1")
      this._value = this.mdcComponent.value;
      this.dispatchEvent(new CustomEvent("change", { detail: { value : this._value, custommarker, origmarker }}));
    });

    this.rootElement.addEventListener("MDCSlider:input", (e) => {
      var origmarker = this.querySelector(".mdc-slider__pin-value-marker")
      var custommarker = this.querySelector(".marker1")
      this._value = this.mdcComponent.value;
      this.dispatchEvent(new CustomEvent("input", { detail: { value : this._value, custommarker, origmarker }}));
    });

    this.applyValue();
    this.applyDisabled();
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
  }

  resizehandler () {
    if (this.mdcComponent) {
      this.mdcComponent.layout();
    }
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

  refresh() {
    this.mdcComponent
  }
}

window.customElements.define("cc-mdc-slider", CcMdcSlider);

