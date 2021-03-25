class CcMdcSelect extends HTMLElement {
  constructor(label) {
    super();
    this.label = label;
    this._value = undefined;
    this._disabled = false;
    this._items = [];
    this.width = 200;
    this.customheight = 0;
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
  }

  addItem (html, value) {
    var stringifiedvalue = JSON.stringify(value);
    if (this.mdcList) {
      var li = document.createElement("li");
      if (this._value === stringifiedvalue) {
        li.className = "mdc-list-item mdc-list-item--selected";
        li.setAttribute("aria-selected", true);
      } else {
        li.className = "mdc-list-item";
      }
      li.setAttribute("data-value", stringifiedvalue);
      li.innerHTML = `<span class="mdc-list-item__ripple"></span><span class="mdc-list-item__text">${html}</span>`
      this.mdcList.appendChild(li);
      this.mdcComponent.layout();
      this.mdcComponent.layoutOptions();
    } else {
      this._items.push({html, value});
    }
  }

  set selectedIndex (i) {
    this.mdcComponent.selectedIndex = i;
  }

  get selectedIndex () {
    return this.mdcComponent.selectedIndex;
  }

  set value (value) {
    this._value = JSON.stringify(value);
    this.applyValue();
  }

  get value () {
    if (this.mdcComponent) {
      try {
        return JSON.parse(this.mdcComponent.value);
      } catch (e) {}
    }
    try {
      return JSON.parse(this._value);
    } catch (e) {}
    return null;
  }

  applyValue() {
    if (this.mdcComponent && isDefined(this._value)) {
      this.mdcComponent.value = this._value;
    }
  }

  connectedCallback() {
    var label = this.label || this.getAttribute("label") || "";
    var width = this.getAttribute("width") || this.width || 200;

    this.innerHTML = `<div class="mdc-select mdc-select--filled" style="min-width:${width}px;max-width:${width}px;width:${width}px;">
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
    <span class="mdc-floating-label">${label}</span>
    ${this.customheight > 0 ? "" : '<span class="mdc-line-ripple"></span>'}
  </div>

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
      this.dispatchEvent(new CustomEvent("change", {detail: {value : JSON.parse(e.detail.value)}}));
    });
    
    this.mdcList = this.querySelector(".mdc-list");
    this.applyDisabled();
    for(var item of this._items) {
      this.addItem(item.html, item.value);
    }
    this._items = [];
  }

  disconnectedCallback() {
    if (this.mdcComponent) {
      this.mdcComponent.destroy();
    }
  }
}

window.customElements.define("cc-mdc-select", CcMdcSelect);
