class CcMdcFloatingActionButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.style.display = "inline-block";
    
    var label = this.getAttribute("label") || null;
    var icon = this.getAttribute("icon") || "add";

    if (label) {
      this.innerHTML = `<button class="mdc-fab mdc-fab--extended">
      <div class="mdc-fab__ripple"></div>
      <span class="material-icons mdc-fab__icon">${icon}</span>
      <span class="mdc-fab__label">${label}</span>
    </button>`;
    } else {
      this.innerHTML = `<button class="mdc-fab mdc-fab--extended">
      <div class="mdc-fab__ripple"></div>
      <span class="material-icons mdc-fab__icon">${icon}</span>
    </button>`;
    }

    this.button = this.childNodes[0];
    this.mdcComponent = mdc.ripple.MDCRipple.attachTo(this.button);
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
  }
}

window.customElements.define("cc-mdc-floating-action-button", CcMdcFloatingActionButton);
