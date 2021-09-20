class CcMdcListItemDndCb extends CcDragDrop {
  constructor(fillcb) {
    super(true);
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

window.customElements.define("cc-mdc-list-item-dnd-cb", CcMdcListItemDndCb);
