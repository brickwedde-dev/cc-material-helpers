class CcMdcCheckbox extends HTMLElement {
  constructor() {
    super();
    this._disabled = false;
  }

  connectedCallback() {
    globalLabelCount++;

    var label = this.getAttribute("label") || "Label";

    this.innerHTML = `<div class="mdc-form-field">
      <div class="mdc-checkbox">
        <input type="checkbox"
              class="mdc-checkbox__native-control"
              id="cc-mdc-label-${globalLabelCount}"/>
        <div class="mdc-checkbox__background">
          <svg class="mdc-checkbox__checkmark"
              viewBox="0 0 24 24">
            <path class="mdc-checkbox__checkmark-path"
                  fill="none"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
          </svg>
          <div class="mdc-checkbox__mixedmark"></div>
        </div>
        <div class="mdc-checkbox__ripple"></div>
      </div>
      <label for="cc-mdc-label-${globalLabelCount}">${label}</label>
    </div>
    `;

    this.mdcComponent = mdc.checkbox.MDCCheckbox.attachTo(this.childNodes[0]);
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
  }
}

window.customElements.define("cc-mdc-checkbox", CcMdcCheckbox);
