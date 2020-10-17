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

  clear() {
    this.querySelector(".mdc-list").innerHTML = "";
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
  }
}

window.customElements.define("cc-mdc-drawer", CcMdcDrawer);
