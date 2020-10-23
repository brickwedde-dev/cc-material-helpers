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

class CcMdcListItem2 extends HTMLLIElement {
  constructor(html1, html2) {
    super();
    this.html1 = html1;
    this.html2 = html2;
    this.inactive = false;
    this._activated = false;
  }

  connectedCallback() {
    this.className = "mdc-list-item" + (this._activated ? " mdc-list-item--activated" : "");
    this.innerHTML = (this.inactive ? `` : `<span class="mdc-list-item__ripple"></span>`) + 
      `<span class="mdc-list-item__text"><span class="mdc-list-item__primary-text">${this.html1}</span>
      <span class="mdc-list-item__secondary-text">${this.html2}</span></span>`;
  }

  disconnectedCallback() {
  }

  set activated (activated) {
    this._activated = activated;
    this.className = "mdc-list-item" + (this._activated ? " mdc-list-item--activated" : "");
  }
}

window.customElements.define("cc-mdc-list-item2", CcMdcListItem2, { extends: "li" });
