var globalLabelCount = 0;

class CcMdcTextField extends HTMLElement {
  constructor() {
    super();
    this._disabled = false;
  }

  connectedCallback() {
    globalLabelCount++;

    this.type = this.getAttribute("type") || "text";
    var label = this.getAttribute("label") || "Label";

    var type = this.type;
    switch (this.type) {
      case "minutes":
        type = "time";
        break;
    }

    this.innerHTML = `<label class="mdc-text-field mdc-text-field--filled">
  <span class="mdc-text-field__ripple"></span>
  <span class="mdc-floating-label" id="cc-mdc-label-${globalLabelCount}">${label}</span>
  <input type="${type}" class="mdc-text-field__input" aria-labelledby="cc-mdc-label-${globalLabelCount}">
  <span class="mdc-line-ripple"></span>
</label>`;

    this.mdcComponent = mdc.textField.MDCTextField.attachTo(this.childNodes[0]);
    this.input = this.querySelector("input");
    this.applyValue();
    this.applyDisabled();
  }

  set disabled (value) {
    this._disabled = value;
    this.applyDisabled();
  }

  applyDisabled() {
    if (this.input) {
      if (this._disabled) {
        this.input.setAttribute("disabled", true);
      } else {
        this.input.removeAttribute("disabled");
      }
    }
  }

  set value (value) {
    switch (this.type) {
      case "datetime-local":
        if (value) {
          var tzoffset = (new Date()).getTimezoneOffset() * 60000;
          this._value = new Date(value - tzoffset).toISOString().slice(0,-5);
        } else {
          this._value = "";
        }
        break;
      case "minutes":
        this._value = CcMdcTextField_minutesToString(value);
        break;
      default:
        this._value = value;
        break;
    }
    this.applyValue();
  }

  get value () {
    if (this.mdcComponent) {
      switch (this.type) {
        case "minutes":
          var x = this.mdcComponent.value.split(":");
          return parseInt(x[0]) * 60 + parseInt(x[1]);
      }
  
      return this.mdcComponent.value;
    }
    return this._value;
  }

  applyValue() {
    if (this.mdcComponent && isDefined(this._value)) {
      this.mdcComponent.value = this._value;
    }
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
  }
}

window.customElements.define("cc-mdc-text-field", CcMdcTextField);

function CcMdcTextField_minutesToString(value) {
  return ("00" + parseInt(parseInt(value) / 60)).slice(-2) + ":" + ("00" + (parseInt(value) % 60)).slice(-2);
}

