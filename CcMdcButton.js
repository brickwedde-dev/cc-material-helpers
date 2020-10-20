class CcMdcButton extends HTMLElement {
  constructor() {
    super();
  }

  setIcon(icon) {
    this.icon = icon;
    return this;
  }

  setLabel(label) {
    this.label = label;
    return this;
  }

  setActionbar(actionbar) {
    this.actionbar = actionbar;
    return this;
  }
  
  connectedCallback() {
    var label = this.label || this.getAttribute("label") || null;
    var icon = this.icon || this.getAttribute("icon") || null;
    var actionbar = this.actionbar || this.getAttribute("actionbar") || false;

    if (icon && label) {
      this.innerHTML = `<button class="mdc-button mdc-button--raised">
      <i class="material-icons mdc-button__icon" aria-hidden="true">${icon}</i>
      <span class="mdc-button__label">${label}</span>
    </button>`;
    } else if (label) {
      this.innerHTML = `<button class="mdc-button mdc-button--raised">
      <span class="mdc-button__label">${label}</span>
    </button>`;
    } else if (icon) {
      this.innerHTML = `<button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Share">${icon}</button>`;
    }

    this.button = this.childNodes[0];
    this.button.addEventListener("click", (e) => {
      this.dispatchEvent(new CustomEvent("click", {detail: e}));
    });
    if (!actionbar) {
      this.mdcComponent = mdc.ripple.MDCRipple.attachTo(this.button);
    }
  }

  disconnectedCallback() {
    if (this.mdcComponent) {
      this.mdcComponent.destroy();
    }
  }
}

window.customElements.define("cc-mdc-button", CcMdcButton);
