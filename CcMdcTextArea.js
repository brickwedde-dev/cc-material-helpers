class CcMdcTextArea extends HTMLElement {
  constructor() {
    super();
    this._disabled = false;
  }

  connectedCallback() {
    globalLabelCount++;
    var label = this._label || this.getAttribute("label") || "Label";

    var hasWidth = ("" + this.style.width).indexOf("px") > 0;

    this.innerHTML = html`<label class="mdc-text-field mdc-text-field--filled mdc-text-field--textarea" ${hasWidth ? `style="width:100%;height:100%;"` : ``}>
    <span class="mdc-text-field__ripple"></span>
    <span class="mdc-floating-label" id="cc-mdc-label-${globalLabelCount}">${label}</span>
    <span class="mdc-text-field__resizer">
      <textarea class="mdc-text-field__input" rows="8" cols="40" aria-label="${label}"></textarea>
    </span>
    <span class="mdc-line-ripple"></span>
  </label>`;

    this.mdcComponent = mdc.textField.MDCTextField.attachTo(this.childNodes[0]);
    this.input = this.querySelector("textarea");

    var targetfun = htmlFunctionArray[this.getAttribute(".target")];
    if (targetfun && targetfun.func && targetfun.func instanceof CcD5cHolder) {
      let d5cholder = targetfun.func;
      d5cholder.addEventListener("d5c_changed", () => {
        this.value = d5cholder.toString();
      })
      this.addEventListener("change", () => {
        d5cholder.setValue(this.value);
      });
      this.value = d5cholder.toString();
    } else if (targetfun && targetfun.func && targetfun.func.__isTarget) {
      var { obj, prop } = targetfun.func();
      this.addEventListener("change", () => {
        obj[prop] = this.value;
      });
      if (isDefined(obj[prop])) {
        this.value = obj[prop];
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
    if (this.input) {
      if (this._disabled) {
        this.input.setAttribute("disabled", true);
      } else {
        this.input.removeAttribute("disabled");
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
      return this.mdcComponent.value;
    }
    return this._value;
  }

  applyValue() {
    if (this.mdcComponent && isDefined(this._value)) {
      this.mdcComponent.value = this._value;
    }
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
  }
}

window.customElements.define("cc-mdc-textarea", CcMdcTextArea);

