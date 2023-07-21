var globalLabelCount = 0;

class CcMdcTextField extends HTMLElement {
  constructor() {
    super();
    this._disabled = false;
  }

  connectedCallback() {
    globalLabelCount++;

    var step = this.getAttribute("step") || undefined;
    var min = this.getAttribute("min") || undefined;
    var max = this.getAttribute("max") || undefined;

    this.type = this.getAttribute("type") || this.type || "text";
    var label = this.getAttribute("label") || this.label || "Label";
    var pattern = this.getAttribute("pattern") || this.pattern || undefined;

    if (this.hasAttribute("value")) {
      this._value = this.getAttribute("value");
    }
    this._disabled = this.getAttribute("disabled") ? true : false;

    var hasWidth = ("" + this.style.width).indexOf("px") > 0;

    var type = this.type;
    switch (this.type) {
      case "minutes":
        type = "time";
        break;
    }

    if (this.type == "color") {
      this.innerHTML = html`<label class="mdc-text-field mdc-text-field--filled" ${hasWidth ? `style="width:100%"` : `style="width:140px"`}>
  <span class="mdc-text-field__ripple"></span>
  <span class="mdc-floating-label" id="cc-mdc-label-${globalLabelCount}">${label}</span>
  <span style="white-space:nowrap;">
    <input type="text" ${isDefined(step) ? `step="${step}"` : ``} ${isDefined(min) ? `min="${min}"` : ``} ${isDefined(max) ? `max="${max}"` : ``} ${isDefined(pattern) ? `pattern="${pattern}"` : ``} class="mdc-text-field__input" aria-labelledby="cc-mdc-label-${globalLabelCount}">
    <button style="vertical-align:top;padding:0px;border:0px;display:inline-block;width:24px;height:24px;"></button>  
  </span>
  <span class="mdc-line-ripple"></span>
</label>`;
      this.mdcComponent = mdc.textField.MDCTextField.attachTo(this.childNodes[0]);
      this.label = this.querySelector("label");
      this.input = this.querySelector("input");
      this.button = this.querySelector("button");
      var ph = this.input.offsetHeight;
      this.input.style.width = (this.input.offsetWidth - ph) + "px"
      this.button.style.minWidth = parseInt(ph) + "px";
      this.button.style.width = parseInt(ph) + "px";
      this.button.style.height = parseInt(ph) + "px";
      this.button.addEventListener("click", () => {
        CcColorPickerDlg(t9n`color picker`, this.value)
        .then((color) => {
          this.value = "#" + color.rgba[0].toString(16).pad(2) + color.rgba[1].toString(16).pad(2) + color.rgba[2].toString(16).pad(2);
        })
        .catch((e) => {
          console.error(e)
        });
      })
      this.input.addEventListener("change", () => {
        this.button.style.backgroundColor = this.value;
      })
      this.input.addEventListener("input", () => {
        this.button.style.backgroundColor = this.value;
      })
    } else {
      this.innerHTML = html`<label class="mdc-text-field mdc-text-field--filled" ${hasWidth ? `style="width:100%"` : ``}>
  <span class="mdc-text-field__ripple"></span>
  <span class="mdc-floating-label" id="cc-mdc-label-${globalLabelCount}">${label}</span>
  <input type="${type}" ${isDefined(step) ? `step="${step}"` : ``} ${isDefined(min) ? `min="${min}"` : ``} ${isDefined(max) ? `max="${max}"` : ``} ${isDefined(pattern) ? `pattern="${pattern}"` : ``} class="mdc-text-field__input" aria-labelledby="cc-mdc-label-${globalLabelCount}">
  <span class="mdc-line-ripple"></span>
</label>`;
      this.mdcComponent = mdc.textField.MDCTextField.attachTo(this.childNodes[0]);
      this.label = this.querySelector("label");
      this.input = this.querySelector("input");
    }


    var changefun = htmlFunctionArray[this.getAttribute("@change")];
    if (changefun) {
      this.addEventListener("change", changefun.func);
    }

    let enterfun = htmlFunctionArray[this.getAttribute("@enter")];
    if (enterfun) {
      this.addEventListener("keyup", (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
          enterfun.func();
        }
      });
    }

    var targetfun = htmlFunctionArray[this.getAttribute(".target")];
    if (targetfun && targetfun.func && targetfun.func.__isTarget) {
      var { obj, prop } = targetfun.func();
      this.addEventListener("change", () => {
        obj[prop] = this.value;
      });
      if (isDefined(obj[prop])) {
        this.value = obj[prop];
      }
    }

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
    if (this.label) {
      if (this._disabled) {
        this.label.className = "mdc-text-field mdc-text-field--filled mdc-text-field--disabled";
      } else {
        this.label.className = "mdc-text-field mdc-text-field--filled";
      }
    }
  }

  set value (value) {
    switch (this.type) {
      case "datetime-local":
        if (value) {
          var tzoffset = (new Date()).getTimezoneOffset() * 60000;
          this._value = new Date(value - tzoffset).toISOString().slice(0,-5);
        } else {
          this._value = "";
        }
        break;
      case "minutes":
        this._value = CcMdcTextField_minutesToString(value);
        break;
      case "color":
        this._value = value;
        if (this.button) {
          this.button.style.backgroundColor = value;
        }
        break;
      default:
        this._value = value;
        break;
    }
    this.applyValue();
  }

  get value () {
    if (this.mdcComponent) {
      switch (this.type) {
        case "datetime-local":
          return new Date(this.mdcComponent.value).getTime();
        case "minutes":
          var x = this.mdcComponent.value.split(":");
          return parseInt(x[0]) * 60 + parseInt(x[1]);
      }
  
      return this.mdcComponent.value;
    }
    
    switch (this.type) {
      case "datetime-local":
        return new Date(this._value).getTime();
      case "minutes":
        var x = this._value.split(":");
        return parseInt(x[0]) * 60 + parseInt(x[1]);
    }
    return this._value;
  }

  applyValue() {
    if (this.mdcComponent && isDefined(this._value)) {
      this.mdcComponent.value = this._value;
    }
    if (this.type == "color") {
      if (this.button) {
        this.button.style.backgroundColor = this._value;
      }
    }
  }

  focus() {
    if (this.mdcComponent) {
      this.mdcComponent.focus();
    }
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
  }
}

window.customElements.define("cc-mdc-text-field", CcMdcTextField);

function CcMdcTextField_minutesToString(value) {
  return ("00" + parseInt(parseInt(value) / 60)).slice(-2) + ":" + ("00" + (parseInt(value) % 60)).slice(-2);
}

