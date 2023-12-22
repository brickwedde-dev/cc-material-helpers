class CcMdcRadio extends HTMLElement {
  constructor() {
    super();
    this._disabled = false;
  }

  connectedCallback() {
    globalLabelCount++;

    var label = this._label || this.getAttribute("label") || "Label";
    var name = this.getAttribute("name") || `cc-mdc-label-${globalLabelCount}`;
    if (!isDefined(this.radiovalue)) {
      this.radiovalue = this.getAttribute("value") || "true";
    }

    this.innerHTML = `<div class="mdc-form-field">
      <div class="mdc-form-field">
        <div class="mdc-radio">
          <input class="mdc-radio__native-control" type="radio" id="cc-mdc-label-${globalLabelCount}" name="${name}" value="${this.radiovalue}">
          <div class="mdc-radio__background">
            <div class="mdc-radio__outer-circle"></div>
            <div class="mdc-radio__inner-circle"></div>
          </div>
          <div class="mdc-radio__ripple"></div>
        </div>
        <label for="cc-mdc-label-${globalLabelCount}">${label}</label>
      </div>
    </div>
    `;

    this.mdcRadioDiv = this.querySelector(".mdc-radio");
    this.mdcComponent = mdc.radio.MDCRadio.attachTo(this.mdcRadioDiv);
    this.mdcFormField = mdc.formField.MDCFormField.attachTo(this.querySelector('.mdc-form-field'));
    this.mdcFormField.input = this.mdcComponent;
    this.input = this.querySelector("input");
    this.label = this.querySelector("label");

    var targetfun = htmlFunctionArray[this.getAttribute(".target")];
    if (targetfun && targetfun.func && targetfun.func instanceof CcD5cHolder) {
      let d5cholder = targetfun.func;
      d5cholder.addEventListener("d5c_changed", () => {
        this.value = d5cholder.toString() == this.radiovalue;
      })
      this.addEventListener("change", () => {
        if (this.value) {
          d5cholder.setValue(this.radiovalue);
        }
      });
      this.value = d5cholder.toString() == this.radiovalue;
    } else if (targetfun && targetfun.func && targetfun.func.__isTarget) {
      var { obj, prop } = targetfun.func();
      this.addEventListener("change", () => {
        if (this.value) {
          obj[prop] = this.radiovalue;
        }
      });
      if (isDefined(obj[prop])) {
        this.value = obj[prop] == this.radiovalue;
      }
    }

    var inputfun = htmlFunctionArray[this.getAttribute("@input")];
    if (inputfun) {
      var d = debounce(inputfun.func, 100)
      this.input.addEventListener("input", d);
      this.input.addEventListener("keyup", d);
      this.input.addEventListener("keydown", d);
      this.input.addEventListener("change", d);
    }

    var changefun = htmlFunctionArray[this.getAttribute("@change")];
    if (changefun) {
      this.addEventListener("change", changefun.func);
    }

    this.applyValue();
    this.applyDisabled();
  }

  set disabled (value) {
    this._disabled = value;
    this.applyDisabled();
  }

  applyDisabled() {
    if (this.mdcComponent) {
      if (this._disabled) {
        this.mdcComponent.disabled = true;
      } else {
        this.mdcComponent.disabled = false;
      }
    }
    if (this.label) {
      if (this._disabled) {
        this.label.style.color = "rgba(0, 0, 0, 0.38)";
      } else {
        this.label.style.color = "inherit";
      }
    }
  }

  set label (value) {
    this._label = value;
    var x = this.querySelector(".mdc-floating-label");
    if (x) {
      x.innerText = value;
    }
  }

  set value (value) {
    this._value = value;
    this.applyValue();
  }

  get value () {
    if (this.mdcComponent) {
      return this.mdcComponent.checked;
    }
    return this._value;
  }

  applyValue() {
    if (this.mdcComponent && isDefined(this._value)) {
      if (this._value === "true") {
        this.mdcComponent.checked = true;
      } else if (this._value === "on") {
        this.mdcComponent.checked = true;
      } else if (this._value === true) {
        this.mdcComponent.checked = true;
      } else {
        this.mdcComponent.checked = false;
      }
    }
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
    this.mdcFormField.destroy();
  }
}

window.customElements.define("cc-mdc-radio", CcMdcRadio);
