class CcMdcText extends HTMLElement {
  constructor() {
    super();
    this._disabled = false;
  }

  connectedCallback() {
    globalLabelCount++;

    if (this.hasAttribute("type")) {
      this._type = this.getAttribute("type");
    }

    this.innerHTML = html``;

    var fill = (value) => {
      switch (this._type) {
        case "percent":
          this.innerText = parseFloat(value).toFixed(1).replace(/\./, ",") + " %";
          break;
        case "euro":
          this.innerText = parseFloat(value).toFixed(2).replace(/\./, ",") + " €";
          break;
        case "html":
          this.innerHTML = value;
          break;
        default:
          this.innerText = value;
          break;
      }
    }

    var targetfun = htmlFunctionArray[this.getAttribute(".target")];
    if (targetfun && targetfun.func && targetfun.func instanceof CcD5cHolder) {
      let d5cholder = targetfun.func;
      d5cholder.addEventListener("d5c_changed", () => {
        fill(d5cholder.toString())
      })
      fill(d5cholder.toString())
    } else if (targetfun && targetfun.func && targetfun.func.__isTarget) {
      var { obj, prop } = targetfun.func();
      if (isDefined(obj[prop])) {
        fill(obj[prop]);
      }
    }
  }

  disconnectedCallback() {
  }
}

window.customElements.define("cc-mdc-text", CcMdcText);
