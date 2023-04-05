class CcMdcButton extends HTMLElement {
  constructor() {
    super();
    this._disabled = false;
    this._color = null;
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

    if (icon && icon.charAt && icon.charAt(0) == "/") {
      icon = html`<img src="${icon}" style="width:16px;height:16px;">`;
    }
    var i = this.selfIcon ? this : this.querySelector(".material-icons");
    if (i) {
      i.innerHTML = icon;
    }
    return this;
  }

  setLabel(label) {
    this.label = label;
    return this;
  }

  setSelectStyle(label, value) {
    this.selectlabel = label;
    this.selectvalue = value;

    var sl = this.querySelector("#selectlabel");
    if (sl) {
      sl.innerText = this.selectlabel;
    }
    var sl = this.querySelector("#selectvalue");
    if (sl) {
      sl.innerText = this.selectvalue;
    }
  }

  setActionbar(actionbar) {
    this.actionbar = actionbar;
    return this;
  }

  setColor(color) {
    this._color = color;
    if (this.button) {
      this.button.style.color = this._color;
    }
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
    this.selfIcon = isDefined(this.selfIcon) ? this.selfIcon : ((this.getAttribute("selficon") ? true : false) || false);

    if (icon && icon.charAt && icon.charAt(0) == "/") {
      icon = html`<img src="${icon}" style="width:16px;height:16px;">`;
    }

    this.style.userSelect = "none";

    if (this.selectlabel) {
      this.innerHTML = html`<button style="border:0px;background-color:transparent;padding-top:0px;">
      <div class="mdc-select mdc-select--filled" style="min-width:170px;max-width:170px;width:170px;">
        <div class="mdc-select__anchor mdc-ripple-upgraded" style="--mdc-ripple-fg-size:102px; --mdc-ripple-fg-scale:1.8528; --mdc-ripple-fg-translate-start:27px, -16px; --mdc-ripple-fg-translate-end:34px, -23px;" tabindex="0" aria-disabled="false" aria-expanded="false">
          <span class="mdc-select__ripple"></span>
          <span class="mdc-select__selected-text" style="" id="selectvalue">${this.selectvalue}</span>
          <span class="mdc-floating-label mdc-floating-label--float-above" id="selectlabel">${this.selectlabel}</span><span class="mdc-line-ripple" style="transform-origin: 144px center;"></span>
        </div>
      </div>
    </button>`;
      this.button = this.childNodes[0];
    } else if (icon && label) {
      this.innerHTML = html`<button class="mdc-button mdc-button--raised">
      <i class="material-icons mdc-button__icon" aria-hidden="true">` + icon + `</i>
      <span class="mdc-button__label">` + label + html`</span>
    </button>`;
      this.button = this.childNodes[0];
    } else if (label) {
      this.innerHTML = html`<button class="mdc-button mdc-button--raised">
      <span class="mdc-button__label">` + label + html`</span>
    </button>`;
      this.button = this.childNodes[0];
    } else if (icon) {
      if (this.selfIcon) {
        this.className = "material-icons mdc-button__icon"
        this.innerHTML = icon;
        this.button = this;
      } else {
        this.innerHTML = html`<button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="">` + icon + `</button>`;
        this.button = this.childNodes[0];
      }
    }

    if (this._color) {
      this.button.style.color = this._color;
    }

    this.applyDisabled();
    if (!actionbar) {
      this.mdcComponent = mdc.ripple.MDCRipple.attachTo(this.button);
    }

    var clickfun = this.getAttribute("@click");
    if (htmlFunctionArray[clickfun]) {
      this.addEventListener("click", htmlFunctionArray[clickfun].func);
    }
  }

  disconnectedCallback() {
    if (this.mdcComponent) {
      this.mdcComponent.destroy();
    }
  }
}

window.customElements.define("cc-mdc-button", CcMdcButton);
