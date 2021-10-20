class CcMdcDialog extends HTMLElement {
  constructor() {
    super();
  }

  setHtml(html) {
    this.html = html;

    var dlgContent = this.querySelector("#my-dialog-content");
    if (dlgContent) {
      dlgContent.innerHTML = html;
    }
    return this;
  }

  setContentElement(contentElement) {
    this.contentElement = contentElement;
    return this;
  }

  setType(type) {
    this.type = type;
    return this;
  }
  
  setNoButtons() {
    this.type = "nobuttons";
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
      case "nobuttons":
        this.innerHTML = `<div class="mdc-dialog" style="z-index:1000;">
          <div class="mdc-dialog__container">
            <div class="mdc-dialog__surface"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="my-dialog-title"
              aria-describedby="my-dialog-content">
              <div class="mdc-dialog__content" tabindex="0" id="my-dialog-content" style="max-height:calc(100vh - 70px);"></div>
            </div>
          </div>
          <div class="mdc-dialog__scrim"></div>
        </div>`;
        break;
      default:
      case "alert":
        this.innerHTML = `<div class="mdc-dialog" style="z-index:1000;">
          <div class="mdc-dialog__container">
            <div class="mdc-dialog__surface"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="my-dialog-title"
              aria-describedby="my-dialog-content">
              <div class="mdc-dialog__content" id="my-dialog-content" style="max-height:calc(100vh - 70px);"></div>
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
        this.innerHTML = `<div class="mdc-dialog" style="z-index:1000;">
          <div class="mdc-dialog__container">
            <div class="mdc-dialog__surface"
              style="display:table;";
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="my-dialog-title"
              aria-describedby="my-dialog-content">
              <div class="mdc-dialog__content" id="my-dialog-content" style="box-sizing:border-box;max-height:calc(100vh - 70px);"></div>
              <div class="mdc-dialog__actions">
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="ok">
                  <div class="mdc-button__ripple"></div>
                  <span class="mdc-button__label">${ok}</span>
                </button>
                <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
                  <div class="mdc-button__ripple"></div>
                  <span class="mdc-button__label">${cancel}</span>
                </button>
              </div>
            </div>
          </div>
          <div class="mdc-dialog__scrim"></div>
        </div>`;
        break;
    }
    var dlgContent = this.querySelector("#my-dialog-content");
    if (this.contentElement) {
      if (this.contentElement.setDialogContainer) {
        this.contentElement.setDialogContainer(this);
      }
      dlgContent.appendChild(this.contentElement);
    } else if (html) {
      dlgContent.innerHTML = html;
    }

    this.dialog = this.childNodes[0];
    this.mdcComponent = mdc.dialog.MDCDialog.attachTo(this.dialog);
    switch (type) {
      case "nobuttons":
        this.mdcComponent.escapeKeyAction = "";
        this.mdcComponent.scrimClickAction = "";
        break;
      default:
        this.mdcComponent.escapeKeyAction = "close";
        this.mdcComponent.scrimClickAction = "";
        break;
    }
    
    if (this._open) {
      this.mdcComponent.open();
    }

    this.dialog.addEventListener("MDCDialog:closed", (e) => {
      if (this.dlgResolve) {
        this.dlgResolve(e.detail.action);
      } else {
        this.dlgClosed = e.detail.action;
      }
      setTimeout(() => {
        this.parentNode.removeChild(this);
      }, 100);
    });
  }

  setMaxWidth(width) {
    var surface = this.querySelector(".mdc-dialog__surface");
    surface.style.maxWidth = width;
  }

  disconnectedCallback() {
    this.dlgResolve = null;
    this.dlgReject = null;
    if (this.mdcComponent) {
      this.mdcComponent.destroy();
    }
  }

  registerUpdateEvent(evtSource, evtName, evtHandler) {
    this.evtSource = evtSource;
    this.evtName = evtName;
    this.evtHandler = evtHandler;
  }

  open() {
    this._open = true;
    if (this.mdcComponent) {
      this.mdcComponent.open();
    } else {
      document.body.appendChild(this);
    }

    try {
      if (this.evtSource) {
        this.evtSource.addEventListener(this.evtName, this.evtHandler);
      }
    } catch (e) {
      console.error("CcMdcDialog evtSource error");
      console.error(e);
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

  close() {
    this.mdcComponent.close();
    try {
      if (this.evtSource) {
        this.evtSource.removeEventListener(this.evtName, this.evtHandler);
      }
      this.evtSource = null;
      this.evtName = null;
      this.evtHandler = null;
    } catch (e) {
      console.error("CcMdcDialog evtSource error");
      console.error(e);
    }
  }
}

window.customElements.define("cc-mdc-dialog", CcMdcDialog);

function CcAlert(title, htmlcontent) {
  var dlg = new CcMdcDialog().setHtml(htmlcontent);
  return dlg.open();
}
