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
  
  connectedCallback() {
    var html = this.html || this.getAttribute("html") || null;
    var type = this.type || this.getAttribute("type") || null;
    this._open = this._open || this.getAttribute("open") || false;

    switch (type) {
      default:
      case "alert":
        this.innerHTML = `<div class="mdc-dialog">
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
    }

    this.dialog = this.childNodes[0];
    this.mdcComponent = mdc.dialog.MDCDialog.attachTo(this.dialog);
    if (this._open) {
      this.mdcComponent.open();
    }
  }

  disconnectedCallback() {
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
  }
}

window.customElements.define("cc-mdc-dialog", CcMdcDialog);
