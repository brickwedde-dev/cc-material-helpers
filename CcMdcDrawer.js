class CcMdcDrawer extends HTMLElement {
  constructor() {
    super();
    this._drawerTitleHtml = "";
  }

  connectedCallback() {
    this.innerHTML = `<aside class="mdc-drawer mdc-drawer--dismissible">
      <div class="mdc-drawer__header"></div>
      <div class="mdc-drawer__content"></div>
    </aside>
    <div class="mdc-drawer-app-content" style="height:100%;">
    </div>`;

    this.mdcList = new CcMdcList();
    this.mdcList.lines = 1;
    this.mdcList.dndarrowconfig = this.dndarrowconfig;
    this.querySelector(".mdc-drawer__content").appendChild(this.mdcList);

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
    return this.mdcList.addElement(item);
  }

  showDndArrow(li, position) {
    this.mdcList.showDndArrow(li, position);
  }

  hideDndArrow() {
    this.mdcList.hideDndArrow();
  }

  addHeader(html) {
    var hr = document.createElement("hr");
    hr.className = "mdc-list-divider";
    this.mdcList.appendChild(hr);
    var h6 = document.createElement("h6");
    h6.className = "mdc-list-group__subheader";
    h6.innerHTML = html;
    this.mdcList.appendChild(h6);
  }

  clear() {
    this.mdcList.clearItems();
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
  }
}

window.customElements.define("cc-mdc-drawer", CcMdcDrawer);
