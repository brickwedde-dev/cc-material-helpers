class CcMdcChips extends HTMLElement {
  constructor(label) {
    super();
    this.label = label;
    this._value = {};
    this._disabled = false;
    this._items = [];
    this.width = 200;
    this.valueOnly = false;
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
  
  addItem (html, value, icon) {
    this._items.push({html, value, icon});
    this.applyValue();
  }

  set value (value) {
    this._value = value ? value : {};
    this.applyValue();
  }

  get value () {
    return this._value;
  }

  applyValue() {
    if (!this.mdcElement) {
      return;
    }

    if (this.valueOnly) {
      this.clearChips();

      for(var item in this._value) {
        var div = document.createElement("div");
        div.id = JSON.stringify(item);
        div.className = "mdc-chip";
        div.innerHTML = `<div class="mdc-chip__ripple"></div>
          <span role="gridcell">
            <span role="checkbox" tabindex="0" aria-checked="false" class="mdc-chip__primary-action">
              <span class="mdc-chip__text">${item}</span>
            </span>
          </span>
          `;
        this.mdcElement.appendChild(div);
        this.mdcComponent.addChip(div);
      }

      return;
    }

    for(var item of this._items) {
      var div = document.createElement("div");
      div.id = item.value;
      div.className = "mdc-chip";
      div.innerHTML = `<div class="mdc-chip__ripple"></div>
        <i class="material-icons mdc-chip__icon mdc-chip__icon--leading mdc-chip__icon--leading-hidden"></i>
        <span class="mdc-chip__checkmark" >
          <svg class="mdc-chip__checkmark-svg" viewBox="-2 -3 30 30">
            <path class="mdc-chip__checkmark-path" fill="none" stroke="black"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
          </svg>
        </span>
        <span role="gridcell">
          <span role="checkbox" tabindex="0" aria-checked="false" class="mdc-chip__primary-action">
            <span class="mdc-chip__text">${item.html}</span>
          </span>
        </span>
        ${isDefined(item.icon) ? `
        <span role="gridcell">
          <i class="material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1" role="button">${item.icon}</i>
        </span>` : ``}
        `;
      this.mdcElement.appendChild(div);
      this.mdcComponent.addChip(div);
    }
    this._items = [];
    for(var chip of this.mdcComponent.chips) {
      chip.selected = this._value && this._value[chip.id];
    }
  }

  clearChips() {
    var chips = this.mdcComponent.chips_;
    for(var chip of chips) {
      chip.beginExit();
    }
  }

  connectedCallback() {
    this.style.display = "inline-block";
    
    var label = this.label || this.getAttribute("label") || null;
    var width = this.getAttribute("width") || this.width || 200;

    this.innerHTML = `<div class="mdc-chip-set mdc-chip-set--filter" role="grid"></div>`;

    this.mdcElement = this.childNodes[0];
    this.mdcComponent = mdc.chips.MDCChipSet.attachTo(this.mdcElement);

    this.mdcComponent.listen('MDCChip:selection', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (this.valueOnly) {
        var v = JSON.parse(e.detail.chipId);
        if (this._value[v]) {
          delete this._value[v];
          this.applyValue();
        }
      } else {
        this._value[e.detail.chipId] = e.detail.selected;
        this.dispatchEvent(new CustomEvent("change", {detail: {value : this._value, changed : e.detail.chipId}}));
      }
    });

    this.applyValue();
  }

  disconnectedCallback() {
    if (this.mdcComponent) {
      this.mdcComponent.destroy();
    }
  }
}

window.customElements.define("cc-mdc-chips", CcMdcChips);
