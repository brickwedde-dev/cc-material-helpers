var globalLabelCount = 0;

function isDefined(v) {
  var t = typeof v;
  return t != "null" && t != "undefined" && t != "void";
}

class CcMdcTextField extends HTMLElement {
  constructor() {
    super();
    this._disabled = false;
  }

  connectedCallback() {
    globalLabelCount++;

    var step = this.getAttribute("step") || "";
    var min = this.getAttribute("min") || "";
    var max = this.getAttribute("max") || "";

    this.type = this.getAttribute("type") || "text";
    var label = this.getAttribute("label") || "Label";
    if (this.hasAttribute("value")) {
      this._value = this.getAttribute("value");
    }
    this._disabled = this.getAttribute("disabled") ? true : false;

    var hasWidth = ("" + this.style.width).indexOf("px") > 0;

    var type = this.type;
    switch (this.type) {
      case "minutes":
        type = "time";
        break;
    }

    this.innerHTML = `<label class="mdc-text-field mdc-text-field--filled" ${hasWidth ? `style="width:100%"` : ``}>
  <span class="mdc-text-field__ripple"></span>
  <span class="mdc-floating-label" id="cc-mdc-label-${globalLabelCount}">${label}</span>
  <input type="${type}" step="${step}" ${min ? `min="${min}"` : ``} ${max ? `max="${max}"` : ``} class="mdc-text-field__input" aria-labelledby="cc-mdc-label-${globalLabelCount}">
  <span class="mdc-line-ripple"></span>
</label>`;

    this.mdcComponent = mdc.textField.MDCTextField.attachTo(this.childNodes[0]);
    this.label = this.querySelector("label");
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
    if (this.label) {
      if (this._disabled) {
        this.label.className = "mdc-text-field mdc-text-field--filled mdc-text-field--disabled";
      } else {
        this.label.className = "mdc-text-field mdc-text-field--filled";
      }
    }
  }

  set value (value) {
    switch (this.type) {
      case "datetime-local":
        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        this._value = new Date(value - tzoffset).toISOString().slice(0,-5);
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
        case "datetime-local":
          return new Date(this.mdcComponent.value).getTime();
        case "minutes":
          var x = this.mdcComponent.value.split(":");
          return parseInt(x[0]) * 60 + parseInt(x[1]);
      }
  
      return this.mdcComponent.value;
    }
    
    switch (this.type) {
      case "datetime-local":
        return new Date(this._value).getTime();
      case "minutes":
        var x = this._value.split(":");
        return parseInt(x[0]) * 60 + parseInt(x[1]);
    }
    return this._value;
  }

  applyValue() {
    if (this.mdcComponent && isDefined(this._value)) {
      this.mdcComponent.value = this._value;
    }
  }

  focus() {
    if (this.mdcComponent) {
      this.mdcComponent.focus();
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

