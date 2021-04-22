class CcMdcListItem extends HTMLLIElement {
  constructor(name, icon) {
    super();
    this.name = name;
    this.icon = icon;
    this._inactive = false;
    this._activated = false;
    this._selected = false;
  }

  connectedCallback() {
    this.className = "mdc-list-item" + (this._activated ? " mdc-list-item--activated" : "") + (this._selected ? " mdc-list-item--selected" : "");
    this.style.cursor = this._inactive ? "default" : "pointer";
    this.ariaCurrent = "page";
    if (typeof this.icon == "object") {
      if (this.icon.src) {
        this.innerHTML = (this._inactive ? `` : `<span class="mdc-list-item__ripple"></span>`) + 
        `<img style="max-width:${this.icon.maxwidth}px;width:${this.icon.width}px;max-height:${this.icon.maxheight}px;height:${this.icon.height}px;margin-right:${this.icon.marginright}px;filter: invert(${this.icon.invert});" src="${this.icon.src}"/>
        <span class="mdc-list-item__text">${this.name}</span>`;
      } else if (this.icon.icon) {
        this.innerHTML = (this._inactive ? `` : `<span class="mdc-list-item__ripple"></span>`) + 
        `<i style="max-width:${this.icon.maxwidth}px;width:${this.icon.width}px;max-height:${this.icon.maxheight}px;height:${this.icon.height}px;margin-right:${this.icon.marginright}px;filter: invert(${this.icon.invert});" class="material-icons mdc-list-item__graphic" aria-hidden="true">${this.icon.icon}</i>
        <span class="mdc-list-item__text">${this.name}</span>`;
      }
    } else {
      this.innerHTML = (this._inactive ? `` : `<span class="mdc-list-item__ripple"></span>`) + 
        `<i class="material-icons mdc-list-item__graphic" aria-hidden="true">${this.icon}</i>
        <span class="mdc-list-item__text">${this.name}</span>`;
    }
  }

  disconnectedCallback() {
  }

  set activated (activated) {
    this._activated = activated;
    this.style.cursor = this._inactive ? "default" : "pointer";
    this.className = "mdc-list-item" + (this._activated ? " mdc-list-item--activated" : "") + (this._selected ? " mdc-list-item--selected" : "");
  }

  set selected (selected) {
    this._selected = selected;
    this.style.cursor = this._inactive ? "default" : "pointer";
    this.className = "mdc-list-item" + (this._activated ? " mdc-list-item--activated" : "") + (this._selected ? " mdc-list-item--selected" : "");
  }

  set inactive (inactive) {
    this._inactive = inactive;
    this.style.cursor = this._inactive ? "default" : "pointer";
    this.className = "mdc-list-item" + (this._activated ? " mdc-list-item--activated" : "") + (this._selected ? " mdc-list-item--selected" : "");
  }
}

window.customElements.define("cc-mdc-list-item", CcMdcListItem, { extends: "li" });

class CcMdcListItem2 extends HTMLLIElement {
  constructor(html1, html2) {
    super();
    this._html1 = html1;
    this._html2 = html2;
    this._inactive = false;
    this._activated = false;
    this._connected = false;
    this.fillcb = null;
  }

  connectedCallback() {
    this._connected = true;
    this.redraw();
  }

  redraw ()  {
    this.className = "mdc-list-item" + (this._activated ? " mdc-list-item--activated" : "");
    this.style.cursor = this._inactive ? "default" : "pointer";
    if (this._connected) {
      if (this.fillcb) {
        this.fillcb(this);
      } else {
        this.innerHTML = (this._inactive ? `` : `<span class="mdc-list-item__ripple"></span>`) + 
          `<span class="mdc-list-item__text"><span class="mdc-list-item__primary-text">${this._html1}</span>
          <span class="mdc-list-item__secondary-text">${this._html2}</span></span>`;
      }
    }
  }

  setFillCallback (fillcb) {
    this.fillcb = fillcb;
  }

  set html1 (html1) {
    this._html1 = html1;
    this.redraw();
  }
  
  set html2 (html2) {
    this._html2 = html2;
    this.redraw();
  }
  
  disconnectedCallback() {
    this._connected = false;
  }

  set activated (activated) {
    this._activated = activated;
    this.className = "mdc-list-item" + (this._activated ? " mdc-list-item--activated" : "") + (this._selected ? " mdc-list-item--selected" : "");
    this.style.cursor = this._inactive ? "default" : "pointer";
  }

  set inactive (inactive) {
    this._inactive = inactive;
    this.className = "mdc-list-item" + (this._activated ? " mdc-list-item--activated" : "") + (this._selected ? " mdc-list-item--selected" : "");
    this.style.cursor = this._inactive ? "default" : "pointer";
  }
}

window.customElements.define("cc-mdc-list-item2", CcMdcListItem2, { extends: "li" });



class CcMdcListItemCb extends HTMLLIElement {
  constructor(fillcb) {
    super();
    this._inactive = false;
    this._activated = false;
    this._connected = false;
    this.fillcb = fillcb;
  }

  connectedCallback() {
    this._connected = true;
    this.redraw();
  }

  redraw ()  {
    this.className = "mdc-list-item" + (this._activated ? " mdc-list-item--activated" : "") + (this._selected ? " mdc-list-item--selected" : "");
    this.style.cursor = this._inactive ? "default" : "pointer";
    if (this._connected && this.fillcb) {
      this.fillcb(this);
    }
  }

  disconnectedCallback() {
    this.fillcb = null;
  }

  set activated (activated) {
    this._activated = activated;
    this.className = "mdc-list-item" + (this._activated ? " mdc-list-item--activated" : "") + (this._selected ? " mdc-list-item--selected" : "");
    this.style.cursor = this._inactive ? "default" : "pointer";
  }

  set selected (selected) {
    this._selected = selected;
    this.className = "mdc-list-item" + (this._activated ? " mdc-list-item--activated" : "") + (this._selected ? " mdc-list-item--selected" : "");
    this.style.cursor = this._inactive ? "default" : "pointer";
  }

  set inactive (inactive) {
    this._inactive = inactive;
    this.className = "mdc-list-item" + (this._activated ? " mdc-list-item--activated" : "") + (this._selected ? " mdc-list-item--selected" : "");
    this.style.cursor = this._inactive ? "default" : "pointer";
  }
}

window.customElements.define("cc-mdc-list-item-cb", CcMdcListItemCb, { extends: "li" });
