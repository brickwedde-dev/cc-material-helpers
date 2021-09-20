class CcMdcRadio extends HTMLElement {
  constructor() {
    super();
    this._disabled = false;
  }

  connectedCallback() {
    globalLabelCount++;

    var label = this.getAttribute("label") || "Label";
    var name = this.getAttribute("name") || `cc-mdc-label-${globalLabelCount}`;

    this.innerHTML = `<div class="mdc-form-field">
      <div class="mdc-form-field">
        <div class="mdc-radio">
          <input class="mdc-radio__native-control" type="radio" id="cc-mdc-label-${globalLabelCount}" name="${name}">
          <div class="mdc-radio__background">
            <div class="mdc-radio__outer-circle"></div>
            <div class="mdc-radio__inner-circle"></div>
          </div>
          <div class="mdc-radio__ripple"></div>
        </div>
        <label for="cc-mdc-label-${globalLabelCount}">${label}</label>
      </div>
    </div>
    `;

    this.mdcRadioDiv = this.querySelector(".mdc-radio");
    this.mdcComponent = mdc.radio.MDCRadio.attachTo(this.mdcRadioDiv);
    this.mdcFormField = mdc.formField.MDCFormField.attachTo(this.querySelector('.mdc-form-field'));
    this.mdcFormField.input = this.mdcComponent;
    this.input = this.querySelector("input");
    this.label = this.querySelector("label");
    this.applyValue();
    this.applyDisabled();
  }

  set disabled (value) {
    this._disabled = value;
    this.applyDisabled();
  }

  applyDisabled() {
    if (this.mdcComponent) {
      if (this._disabled) {
        this.mdcComponent.disabled = true;
      } else {
        this.mdcComponent.disabled = false;
      }
    }
    if (this.label) {
      if (this._disabled) {
        this.label.style.color = "rgba(0, 0, 0, 0.38)";
      } else {
        this.label.style.color = "inherit";
      }
    }
  }

  set value (value) {
    this._value = value;
    this.applyValue();
  }

  get value () {
    if (this.mdcComponent) {
      return this.mdcComponent.checked;
    }
    return this._value;
  }

  applyValue() {
    if (this.mdcComponent && isDefined(this._value)) {
      if (this._value === "true") {
        this.mdcComponent.checked = true;
      } else if (this._value === "false") {
        this.mdcComponent.checked = false;
      } else if (this._value === "on") {
        this.mdcComponent.checked = true;
      } else if (this._value === true) {
        this.mdcComponent.checked = true;
      } else if (this._value === false) {
        this.mdcComponent.checked = false;
      } else {
        this.mdcComponent.checked = this._value;
      }
    }
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
    this.mdcFormField.destroy();
  }
}

window.customElements.define("cc-mdc-radio", CcMdcRadio);
