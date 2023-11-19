class CcMdcSelect extends HTMLElement {
  constructor(label) {
    super();
    this.label = label;
    this._value = JSON.stringify(undefined);
    this._disabled = false;
    this._items = [];
    this.width = 200;
    this.customheight = 0;
    this.menuContainerMinWidth = 112;
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
  }
  
  removeItems() {
    this._items = [];
    if (this.mdcList) {
      while (this.mdcList.childNodes.length > 0) {
        this.mdcList.removeChild(this.mdcList.childNodes[0]);
      }
    }
    if (this.mdcComponent) {
      this.mdcComponent.layout();
      this.mdcComponent.layoutOptions();
    }
  }

  addItem (html, value) {
    return this.addItems([{html, value}]);
  }

  addItems (items) {
    for(var item of items) {
      var stringifiedvalue = JSON.stringify(item.value);
      if (this.mdcList) {
        var li = document.createElement("li");
        if (this._value === stringifiedvalue) {
          li.className = "mdc-list-item mdc-list-item--selected";
          li.setAttribute("aria-selected", true);
        } else {
          li.className = "mdc-list-item";
        }
        li.setAttribute("data-value", stringifiedvalue);
        if (isDefined(item.html)) {
          if (item.html instanceof HTMLElement) {
            li.innerHTML = `<span class="mdc-list-item__ripple"></span>`;
            item.html.className = (item.html.className ? item.html.className + " " : "") + "mdc-list-item__text"
            li.appendChild(item.html)
          } else {
            li.innerHTML = `<span class="mdc-list-item__ripple"></span><span class="mdc-list-item__text">${item.html}</span>`;
          }
        } else if (isDefined(item.name)) {
          li.innerHTML = html`<span class="mdc-list-item__ripple"></span><span class="mdc-list-item__text">${item.name}</span>`;
        }

        this.mdcList.appendChild(li);
      } else {
        this._items.push(item);
      }
    }
    if (this.mdcComponent) {
      this.mdcComponent.layout();
      this.mdcComponent.layoutOptions();
    }
  }

  set selectedIndex (i) {
    if (this.mdcComponent) {
      try {
        this.mdcComponent.selectedIndex = i;
      } catch(e) {
      }
    }
  }

  get selectedIndex () {
    return this.mdcComponent ? this.mdcComponent.selectedIndex : -1;
  }

  set value (value) {
    this._value = JSON.stringify(value);
    this.applyValue();
  }

  get value () {
    if (this.mdcComponent) {
      try {
        if (this.mdcComponent.value) {
          return JSON.parse(this.mdcComponent.value);
        }
      } catch (e) {}
    }
    try {
      if (this._value) {
        return JSON.parse(this._value);
      }
    } catch (e) {}
    return null;
  }

  applyValue() {
    if (this.mdcComponent && isDefined(this._value)) {
      try {
        this.mdcComponent.value = this._value;
      } catch (e) {
      }
    }
  }

  connectedCallback() {
    var label = this.label || this.getAttribute("label") || "";
    var width = this.getAttribute("width") || this.width || 200;

    var hasWidth = ("" + this.style.width).indexOf("px") > 0;

    this.innerHTML = html`<div class="mdc-select mdc-select--filled" ${hasWidth ? `style="width:100%"` : `style="min-width:${width}px;max-width:${width}px;width:${width}px;"`}>
  <div class="mdc-select__anchor" style="${this.customheight > 0 ? "height:" + this.customheight + "px;align-items:inherit;padding-left:0px;" : ""}">
    <span class="mdc-select__ripple"></span>
    <span class="mdc-select__selected-text" style="${this.customheight > 0 ? "font-size:" + parseInt(this.customheight * 0.6) + "px;line-height:" + this.customheight + "px;height:" + this.customheight + "px;" : ""}"></span>
    <span class="mdc-select__dropdown-icon" style="${this.customheight > 0 ? "margin-left:0px;margin-right:0px;" : ""}">
      <svg
          class="mdc-select__dropdown-icon-graphic"
          viewBox="7 10 10 5">
        <polygon
            class="mdc-select__dropdown-icon-inactive"
            stroke="none"
            fill-rule="evenodd"
            points="7 10 12 15 17 10">
        </polygon>
        <polygon
            class="mdc-select__dropdown-icon-active"
            stroke="none"
            fill-rule="evenodd"
            points="7 15 12 10 17 15">
        </polygon>
      </svg>
    </span>
    <span class="mdc-floating-label">${label}</span>` +
    (this.customheight > 0 ? "" : '<span class="mdc-line-ripple"></span>') + 
    html`  </div>

  <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fixed">
    <ul class="mdc-list">
    </ul>
  </div>
</div>`;

    var elem = this.childNodes[0];
    this.mdcComponent = mdc.select.MDCSelect.attachTo(elem);
//    this.mdcComponent.setFixedPosition(true)
    elem.addEventListener("MDCSelect:change", (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.dispatchEvent(new CustomEvent("change", {detail: {value : e.detail.value ? JSON.parse(e.detail.value) : undefined }}));
    });
    
    var menuContainer = this.querySelector(".mdc-menu");
    menuContainer.style.minWidth = `${this.menuContainerMinWidth}px`;

    this.mdcList = this.querySelector(".mdc-list");
    this.applyDisabled();
    for(var item of this._items) {
      this.addItem(item.html, item.value);
    }
    this._items = [];

    var changefun = this.getAttribute("@change");
    if (htmlFunctionArray[changefun]) {
      let fun = htmlFunctionArray[changefun];
      this.addEventListener("change", (e) => {setTimeout(() => {fun.func(e)},0)});
    }

    var targetfun = htmlFunctionArray[this.getAttribute(".target")];
    if (targetfun && targetfun.func && targetfun.func instanceof CcD5cHolder) {
      let d5cholder = targetfun.func;
      d5cholder.addEventListener("d5c_changed", () => {
        if (this.value != d5cholder.toString()) {
          this.value = d5cholder.toString();
        }
      })
      this.addEventListener("change", () => {
        d5cholder.setValue(this.value);
      });
      this.value = d5cholder.toString();
    } else if (targetfun && targetfun.func && targetfun.func.__isTarget) {
      let { obj, prop } = targetfun.func();
      this.addEventListener("change", () => {
        obj[prop] = this.value;
      });
      if (isDefined(obj[prop])) {
        this.value = obj[prop];
      }
    }

    var targetfun = this.getAttribute(".options");
    if (htmlFunctionArray[targetfun] && htmlFunctionArray[targetfun].func && htmlFunctionArray[targetfun].func.__isOptions) {
      try {
        let obj = htmlFunctionArray[targetfun].func();
        if (obj instanceof Array) {
          this.addItems(obj);
        } else if (obj instanceof Function || obj instanceof Promise) {
          var fetcher = obj();
          fetcher
          .then((results) => {
            results = JSON.parse(JSON.stringify(results));
            this.addItems(results);
          })
          .catch(()=>{
          });
        }
      } catch (e) {
      }
    }
  }

  disconnectedCallback() {
    if (this.mdcComponent) {
      this.mdcComponent.destroy();
    }
  }
}

window.customElements.define("cc-mdc-select", CcMdcSelect);
