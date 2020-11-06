class CcMdcDialog extends HTMLElement {
  constructor() {
    super();
  }

  setHtml(html) {
    this.html = html;
    return this;
  }

  setType(type) {
    this.type = type;
    return this;
  }
  
  setOkCancel(ok, cancel) {
    this.type = "okcancel";
    this.ok = ok;
    this.cancel = cancel;
    return this;
  }
  
  connectedCallback() {
    var html = this.html || this.getAttribute("html") || null;
    var type = this.type || this.getAttribute("type") || null;
    this._open = this._open || this.getAttribute("open") || false;

    var ok = this.ok || this.getAttribute("ok") || "Ok";
    var cancel = this.cancel || this.getAttribute("cancel") || "Abbruch";

    switch (type) {
      default:
      case "alert":
        this.innerHTML = `<div class="mdc-dialog" style="z-index:999999;">
          <div class="mdc-dialog__container">
            <div class="mdc-dialog__surface"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="my-dialog-title"
              aria-describedby="my-dialog-content">
              <div class="mdc-dialog__content" id="my-dialog-content">${html}</div>
              <div class="mdc-dialog__actions">
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
                  <div class="mdc-button__ripple"></div>
                  <span class="mdc-button__label">Ok</span>
                </button>
              </div>
            </div>
          </div>
          <div class="mdc-dialog__scrim"></div>
        </div>`;
        break;
      case "okcancel":
        this.innerHTML = `<div class="mdc-dialog" style="z-index:999999;">
          <div class="mdc-dialog__container">
            <div class="mdc-dialog__surface"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="my-dialog-title"
              aria-describedby="my-dialog-content">
              <div class="mdc-dialog__content" id="my-dialog-content">${html}</div>
              <div class="mdc-dialog__actions">
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
                  <div class="mdc-button__ripple"></div>
                  <span class="mdc-button__label">${cancel}</span>
                </button>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="ok">
                  <div class="mdc-button__ripple"></div>
                  <span class="mdc-button__label">${ok}</span>
                </button>
              </div>
            </div>
          </div>
          <div class="mdc-dialog__scrim"></div>
        </div>`;
        break;
    }

    this.dialog = this.childNodes[0];
    this.mdcComponent = mdc.dialog.MDCDialog.attachTo(this.dialog);
    if (this._open) {
      this.mdcComponent.open();
    }

    this.dialog.addEventListener("MDCDialog:closed", (e) => {
      if (this.dlgResolve) {
        this.dlgResolve(e.detail.action);
      } else {
        this.dlgClosed = e.detail.action;
      }
    });
  }

  disconnectedCallback() {
    this.dlgResolve = null;
    this.dlgReject = null;
    if (this.mdcComponent) {
      this.mdcComponent.destroy();
    }
  }

  open() {
    this._open = true;
    if (this.mdcComponent) {
      this.mdcComponent.open();
    } else {
      document.body.appendChild(this);
    }

    return new Promise((resolve, reject) => {
      if (this.dlgClosed) {
        resolve(this.dlgClosed);
      } else {
        this.dlgResolve = resolve;
        this.dlgReject = reject;
      }
    });
  }
}

window.customElements.define("cc-mdc-dialog", CcMdcDialog);
