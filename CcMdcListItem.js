class CcMdcListItem extends HTMLAnchorElement {
  constructor(name, icon) {
    super();
    this.name = name;
    this.icon = icon;
  }

  connectedCallback() {
    this.className = "mdc-list-item mdc-list-item--activated";
    this.href = "#";
    this.ariaCurrent = "page";
    this.innerHTML = `<span class="mdc-list-item__ripple"></span>
    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">${this.icon}</i>
    <span class="mdc-list-item__text">${this.name}</span>`;
  }

  disconnectedCallback() {
  }
}

window.customElements.define("cc-mdc-list-item", CcMdcListItem, { extends: "a" });
