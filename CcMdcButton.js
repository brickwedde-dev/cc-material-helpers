class CcMdcButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    var label = this.getAttribute("label") || "Label";
    var icon = this.getAttribute("icon") || null;

    if (icon) {
      this.innerHTML = `<button class="mdc-button mdc-button--raised">
      <i class="material-icons mdc-button__icon" aria-hidden="true">${icon}</i>
      <span class="mdc-button__label">${label}</span>
    </button>`;
    } else {
      this.innerHTML = `<button class="mdc-button mdc-button--raised">
      <span class="mdc-button__label">${label}</span>
    </button>`;
    }

    this.button = this.childNodes[0];
    this.mdcComponent = mdc.ripple.MDCRipple.attachTo(this.button);
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
  }
}

window.customElements.define("cc-mdc-button", CcMdcButton);
