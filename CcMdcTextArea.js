class CcMdcTextArea extends HTMLElement {
  constructor() {
    super();
    this._disabled = false;
  }

  connectedCallback() {
    globalLabelCount++;
    var label = this.getAttribute("label") || "Label";

    var hasWidth = ("" + this.style.width).indexOf("px") > 0;

    this.innerHTML = html`<label class="mdc-text-field mdc-text-field--filled mdc-text-field--textarea" ${hasWidth ? `style="width:100%;height:100%;"` : ``}>
    <span class="mdc-text-field__ripple"></span>
    <span class="mdc-floating-label" id="cc-mdc-label-${globalLabelCount}">${label}</span>
    <span class="mdc-text-field__resizer">
      <textarea class="mdc-text-field__input" rows="8" cols="40" aria-label="${label}"></textarea>
    </span>
    <span class="mdc-line-ripple"></span>
  </label>`;

    this.mdcComponent = mdc.textField.MDCTextField.attachTo(this.childNodes[0]);
    this.input = this.querySelector("textarea");
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

window.customElements.define("cc-mdc-textarea", CcMdcTextArea);

