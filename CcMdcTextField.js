var globalLabelCount = 0;

class CcMdcTextField extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    globalLabelCount++;

    var type = this.getAttribute("type") || "text";
    var label = this.getAttribute("label") || "Label";

    this.innerHTML = `<label class="mdc-text-field mdc-text-field--filled">
  <span class="mdc-text-field__ripple"></span>
  <span class="mdc-floating-label" id="cc-mdc-label-${globalLabelCount}">${label}</span>
  <input type="${type}" class="mdc-text-field__input" aria-labelledby="cc-mdc-label-${globalLabelCount}">
  <span class="mdc-line-ripple"></span>
</label>`;

    this.mdcComponent = mdc.textField.MDCTextField.attachTo(this.childNodes[0]);
    this.input = this.querySelector("input");
    this.applyValue();
  }

  set value (value) {
    this._value = value;
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

window.customElements.define("cc-mdc-text-field", CcMdcTextField);
