class CcMdcDrawer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `<aside class="mdc-drawer mdc-drawer--dismissible">
      <div class="mdc-drawer__header">
        <h3 class="mdc-drawer__title">Cc-Sample</h3>
        <h6 class="mdc-drawer__subtitle">alex@brickwedde.dev</h6>
      </div>
      <div class="mdc-drawer__content">
      <div class="mdc-list"></div>
    </div>
  </aside>
  <div class="mdc-drawer-app-content">
  </div>`;

    this.mdcComponent = mdc.drawer.MDCDrawer.attachTo(this.childNodes[0]);
    this.mdcComponent.open = true;
    this.contentElement = this.querySelector(".mdc-drawer-app-content");
  }

  addItem(item) {
    this.querySelector(".mdc-list").appendChild(item);
  }

  addHeader(html) {
    var list = this.querySelector(".mdc-list");
    var hr = document.createElement("hr");
    hr.className = "mdc-list-divider";
    list.appendChild(hr);
    var h6 = document.createElement("h6");
    h6.className = "mdc-list-group__subheader";
    h6.innerHTML = html;
    list.appendChild(h6);
  }

  clear() {
    this.querySelector(".mdc-list").innerHTML = "";
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
  }
}

window.customElements.define("cc-mdc-drawer", CcMdcDrawer);
