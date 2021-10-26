class CcMdcButton extends HTMLElement {
  constructor() {
    super();
    this._disabled = false;
    this.addEventListener("click", (e) => {
      if (this._disabled) {
        e.cancelBubble = true;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    });
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

  set disabled (value) {
    this._disabled = value;
    this.applyDisabled();
  }

  applyDisabled() {
    if (this.button) {
      if (this._disabled) {
        this.button.setAttribute("disabled", true);
      } else {
        this.button.removeAttribute("disabled");
      }
    }
  }
  
  connectedCallback() {
    var label = this.label || this.getAttribute("label") || null;
    var icon = this.icon || this.getAttribute("icon") || null;
    var actionbar = this.actionbar || this.getAttribute("actionbar") || false;

    if (icon && icon.charAt && icon.charAt(0) == "/") {
      icon = html`<img src="${icon}" style="width:16px;height:16px;">`;
    }

    if (icon && label) {
      this.innerHTML = html`<button class="mdc-button mdc-button--raised">
      <i class="material-icons mdc-button__icon" aria-hidden="true">${icon}</i>
      <span class="mdc-button__label">${label}</span>
    </button>`;
    } else if (label) {
      this.innerHTML = html`<button class="mdc-button mdc-button--raised">
      <span class="mdc-button__label">${label}</span>
    </button>`;
    } else if (icon) {
      this.innerHTML = html`<button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Share">${icon}</button>`;
    }

    this.button = this.childNodes[0];
    this.applyDisabled();
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
