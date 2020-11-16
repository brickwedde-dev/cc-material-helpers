class CcMdcSelect extends HTMLElement {
  constructor(label) {
    super();
    this.label = label;
    this._value = undefined;
    this._disabled = false;
    this._items = [];
    this.width = 200;
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
    return this._value;
  }

  applyValue() {
    if (this.mdcComponent && isDefined(this._value)) {
      this.mdcComponent.value = this._value;
    }
  }

  connectedCallback() {
    var label = this.label || this.getAttribute("label") || null;
    var width = this.getAttribute("width") || this.width || 200;

    this.innerHTML = `<div class="mdc-select mdc-select--filled" style="min-width:${width}px;max-width:${width}px;width:${width}px;">
  <div class="mdc-select__anchor">
    <span class="mdc-select__ripple"></span>
    <span class="mdc-select__selected-text"></span>
    <span class="mdc-select__dropdown-icon">
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
    <span class="mdc-line-ripple"></span>
  </div>

  <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">
    <ul class="mdc-list">
    </ul>
  </div>
</div>`;

    var elem = this.childNodes[0];
    this.mdcComponent = mdc.select.MDCSelect.attachTo(elem);
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
