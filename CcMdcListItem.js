class CcMdcListItem extends HTMLAnchorElement {
  constructor(name, icon) {
    super();
    this.name = name;
    this.icon = icon;
    this.inactive = false;
    this._activated = false;
  }

  connectedCallback() {
    this.className = "mdc-list-item" + (this._activated ? " mdc-list-item--activated" : "");
    this.href = "#";
    this.ariaCurrent = "page";
    this.innerHTML = (this.inactive ? `` : `<span class="mdc-list-item__ripple"></span>`) + 
      `<i class="material-icons mdc-list-item__graphic" aria-hidden="true">${this.icon}</i>
      <span class="mdc-list-item__text">${this.name}</span>`;
  }

  disconnectedCallback() {
  }

  set activated (activated) {
    this._activated = activated;
    this.className = "mdc-list-item" + (this._activated ? " mdc-list-item--activated" : "");
  }
}

window.customElements.define("cc-mdc-list-item", CcMdcListItem, { extends: "a" });
