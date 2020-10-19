class CcMdcDrawer extends HTMLElement {
  constructor() {
    super();
    this._drawerTitleHtml = "";
  }

  connectedCallback() {
    this.innerHTML = `<aside class="mdc-drawer mdc-drawer--dismissible">
      <div class="mdc-drawer__header"></div>
      <div class="mdc-drawer__content">
      <div class="mdc-list"></div>
    </div>
  </aside>
  <div class="mdc-drawer-app-content">
  </div>`;

    this.mdcComponent = mdc.drawer.MDCDrawer.attachTo(this.childNodes[0]);
    this.mdcComponent.open = true;
    this.contentElement = this.querySelector(".mdc-drawer-app-content");

    this.header = this.querySelector(".mdc-drawer__header");
    this.header.innerHTML = this._drawerTitleHtml;
  }

  set drawerTitleHtml (drawerTitleHtml) {
    this._drawerTitleHtml = drawerTitleHtml;
    if (this.header) {
      this.header.innerHTML = this._drawerTitleHtml;
    }
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
