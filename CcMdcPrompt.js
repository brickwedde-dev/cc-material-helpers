class CcMdcPrompt extends HTMLElement {
  constructor() {
    super();
  }
  
  set value (value) {
    this._value = value;
    this.applyValue();
  }

  get value () {
    return this._value;
  }

  applyValue() {
    if (this.availableObjects) {
      var valueinput = this.querySelector("#objects");
      if (valueinput) {
        valueinput.value = this._value;
      }

    } else {
      var valueinput = this.querySelector("#value");
      if (valueinput) {
        valueinput.value = this._value;
      }
    }
  }

  connectedCallback() {
    var label = this.label || this.getAttribute("label") || "";
    var ok = this.ok || this.getAttribute("ok") || "Ok";
    var cancel = this.cancel || this.getAttribute("cancel") || "Abbruch";

    this.innerHTML = `<div class="mdc-dialog" style="z-index:1000;">
      <div class="mdc-dialog__container">
        <div class="mdc-dialog__surface"
          style="display:table;";
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="my-dialog-title"
          aria-describedby="my-dialog-content">
          <div class="mdc-dialog__content" id="my-dialog-content" style="box-sizing:border-box;">
            <cc-mdc-text-field id="value" type="text" style="margin:10px;" label="${label}"></cc-mdc-text-field>
            <cc-mdc-select id="objects" style="margin:10px;" label="${label}"></cc-mdc-select>
          </div>
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

    var dlgContent = this.querySelector("#my-dialog-content");
    if (this.contentElement) {
      if (this.contentElement.setDialogContainer) {
        this.contentElement.setDialogContainer(this);
      }
      dlgContent.appendChild(this.contentElement);
    }

    if (this.availableObjects) {
      var valueinput = this.querySelector("#value");
      valueinput.parentElement.removeChild(valueinput);

      var valueinput = this.querySelector("#objects");
      if (valueinput) {
        for(var obj of this.availableObjects) {
          valueinput.addItem(obj[this.nameProperty], obj[this.idProperty]);
        }
      }
    } else {
      var valueinput = this.querySelector("#objects");
      valueinput.parentElement.removeChild(valueinput);
    }

    this.dialog = this.childNodes[0];
    this.mdcComponent = mdc.dialog.MDCDialog.attachTo(this.dialog);
    this.mdcComponent.escapeKeyAction = "close";
    this.mdcComponent.scrimClickAction = "";
    
    this.mdcComponent.open();

    this.dialog.addEventListener("MDCDialog:closed", (e) => {
      var valueinput;
      if (this.availableObjects) {
        valueinput = this.querySelector("#objects");
      } else {
        valueinput = this.querySelector("#value");
      }
      if (valueinput) {
        this._value = valueinput.value;
      }

      if (this.dlgResolve) {
        this.dlgResolve(e.detail.action);
      }

      setTimeout(() => {
        this.parentNode.removeChild(this);
      }, 100);
    });

    this.applyValue();
  }

  disconnectedCallback() {
    this.dlgResolve = null;
    if (this.mdcComponent) {
      this.mdcComponent.destroy();
    }
  }
}

window.customElements.define("cc-mdc-prompt", CcMdcPrompt);

function CcPrompt(label, defaultvalue) {
  return new Promise((resolve, reject) => {
    var p = new CcMdcPrompt();
    p.label = label;
    p.value = defaultvalue;
    p.dlgResolve = (action) => {
      if (action == "ok") {
        resolve(p.value);
      } else {
        reject();
      }
    };
    document.body.appendChild(p);
  });
}

function CcChooser(label, availableObjects, nameProperty, idProperty, value) {
  return new Promise((resolve, reject) => {
    var p = new CcMdcPrompt();
    p.availableObjects = availableObjects;
    p.nameProperty = nameProperty;
    p.idProperty = idProperty;
    p.label = label;
    p.value = value;
    p.dlgResolve = (action) => {
      if (action == "ok") {
        resolve(p.value);
      } else {
        reject();
      }
    };
    document.body.appendChild(p);
  });
}
