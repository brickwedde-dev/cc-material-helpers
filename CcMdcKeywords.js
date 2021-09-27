class CcMdcKeywords extends HTMLElement {
  constructor(label) {
    super();
    this.label = label;
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
  
  set value (value) {
    try {
      if (value) {
        this._items = JSON.parse(value);
      }
    } catch (e) {
    }
    this.applyValue();
  }

  get value () {
    return JSON.stringify(this._items);
  }

  applyValue() {
    if (!this.mdcElement) {
      return;
    }

    for( var i = this.mdcComponent.chips.length - 1; i >= 0; i--) {
      this.mdcComponent.getDefaultFoundation().adapter.removeChipAtIndex(i);
    }

    for(let i = 0; i < this._items.length; i++) {
      let item = this._items[i];
      var div = document.createElement("div");
      div.id = item.value;
      div.className = "mdc-chip";
      div.innerHTML = `<div class="mdc-chip__ripple"></div>
        <i class="material-icons mdc-chip__icon mdc-chip__icon--leading mdc-chip__icon--leading-hidden"></i>
        <span role="gridcell">
          <span role="checkbox" tabindex="0" aria-checked="false" class="mdc-chip__primary-action">
            <span class="mdc-chip__text">${item}</span>
          </span>
        </span>
        <span role="gridcell">
          <i id="delete" class="material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1" role="button">delete</i>
        </span>
        `;
      this.mdcElement.appendChild(div);

      div.querySelector("#delete").addEventListener("click", (e) => {
        this._items.splice(i, 1);
        this.applyValue();
      });

      this.mdcComponent.addChip(div);
    }

    var div = document.createElement("div");
    div.id = "@@add@@";
    div.className = "mdc-chip";
    div.innerHTML = `<div class="mdc-chip__ripple"></div>
      <i class="material-icons mdc-chip__icon mdc-chip__icon--leading mdc-chip__icon--leading-hidden"></i>
      <span role="gridcell">
        <span role="checkbox" tabindex="0" aria-checked="false" class="mdc-chip__primary-action">
          <span class="mdc-chip__text">${this._label}</span>
        </span>
      </span>
      <span role="gridcell">
        <i class="material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1" role="button">add</i>
      </span>
      `;
    this.mdcElement.appendChild(div);
    this.mdcComponent.addChip(div);
  }

  connectedCallback() {
    this._label = this.label || this.getAttribute("label") || "";
    var width = this.getAttribute("width") || this.width || 200;

    this.innerHTML = `<div class="mdc-chip-set mdc-chip-set--filter" role="grid"></div>`;

    this.mdcElement = this.childNodes[0];
    this.mdcComponent = mdc.chips.MDCChipSet.attachTo(this.mdcElement);

    this.mdcComponent.listen('MDCChip:selection', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (e.detail.chipId == "@@add@@") {
        CcPrompt("Keyword", "")
        .then((keyword) => {
          this._items.push(keyword);
          this.applyValue();
        });
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

window.customElements.define("cc-mdc-keywords", CcMdcKeywords);
