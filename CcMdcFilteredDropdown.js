class CcMdcFilteredDropdown extends HTMLElement {
  constructor() {
    super();
    this._disabled = false;
  }

  connectedCallback() {
    globalLabelCount++;

    var label = this._label || this.getAttribute("label") || "Label";

    if (this.hasAttribute("value")) {
      this._value = this.getAttribute("value");
    }
    this._disabled = this.getAttribute("disabled") ? true : false;

    var hasWidth = ("" + this.style.width).indexOf("px") > 0 || ("" + this.style.width).indexOf("vw") > 0;
    var hasHeight = ("" + this.style.height).indexOf("px") > 0 || ("" + this.style.height).indexOf("vh") > 0;

    this.innerHTML = html`<label class="mdc-text-field mdc-text-field--filled" ${(hasWidth || hasHeight) ? `style="width:100%"` : ``}>
  <span class="mdc-text-field__ripple"></span>
  <span class="mdc-floating-label" id="cc-mdc-label-${globalLabelCount}">${label}</span>
  <input type="text" class="mdc-text-field__input" aria-labelledby="cc-mdc-label-${globalLabelCount}">
  <span class="mdc-line-ripple"></span>
</label>`;

    this.labeldiv = this.querySelector("label");
    this.mdcComponent = mdc.textField.MDCTextField.attachTo(this.labeldiv);
    this.input = this.querySelector("input");

    var targetfun = htmlFunctionArray[this.getAttribute(".target")];
    if (targetfun && targetfun.func && targetfun.func instanceof CcD5cHolder) {
      let d5cholder = targetfun.func;
      this.addEventListener("change", () => {
        d5cholder.setValue(this.value);
      });
    } else if (targetfun && targetfun.func && targetfun.func.__isTarget) {
      var { obj, prop } = targetfun.func();
      this.addEventListener("change", () => {
        obj[prop] = this.value;
      });
    }

    var filterfun = (htmlFunctionArray[this.getAttribute("@filter")]) || (this.filterfun ? { func : this.filterfun} : null);
    if (filterfun) {
      var eh = debounce(() => {
          this._value = this.mdcComponent.value;

          if (this.menu) {
            this.menu.parentNode.removeChild(this.menu);
            this.menu = null;
          }

          if (this._value) {
            var items = filterfun.func(this._value);
            if (items.length > 0) {
              this.menu = new CcMdcMenu();
              this.menu.skipFocus = true;
              var pos = this.getBoundingClientRect()
              this.menu.setAbsolutePosition (pos.x, pos.y + 51);
              document.body.appendChild(this.menu);
              this.menu.addEventListener(("selected"), (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.value = "";
                this.dispatchEvent(new CustomEvent("selected", {detail : e.detail.value}));
              });
              for(var item of items) {
                this.menu.addItem(item.html, item.value);
              }
              this.menu.open = true;
            }
          }
        }, 100);

      var d = () => {
        eh();
      }

      this.input.addEventListener("input", d);
      this.input.addEventListener("keyup", d);
      this.input.addEventListener("keydown", d);
      this.input.addEventListener("change", d);

      this.input.addEventListener("blur", () => {
        this.value = "";
      });
    }

    var changefun = htmlFunctionArray[this.getAttribute("@selected")];
    if (changefun) {
      this.addEventListener("selected", changefun.func);
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
    if (this.labeldiv) {
      if (this._disabled) {
        this.labeldiv.className = "mdc-text-field mdc-text-field--filled mdc-text-field--disabled";
      } else {
        this.labeldiv.className = "mdc-text-field mdc-text-field--filled";
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

window.customElements.define("cc-mdc-filtered-dropdown", CcMdcFilteredDropdown);
