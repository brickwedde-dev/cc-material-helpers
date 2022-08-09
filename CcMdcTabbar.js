class CcMdcTabbar extends HTMLElement {
  constructor() {
    super();
    this.items = [];
    this._activeTab = -1;
  }

  connectedCallback() {
    this.innerHTML = html`<div class="mdc-tab-bar" role="tablist">
      <div class="mdc-tab-scroller">
        <div class="mdc-tab-scroller__scroll-area">
          <div class="mdc-tab-scroller__scroll-content">
          </div>
        </div>
      </div>
    </div>`;

    this.tabbarContent = this.querySelector(".mdc-tab-scroller__scroll-content");
    for (let i = 0; i < this.items.length; i++) {
      var e = this.items[i];
      e.addEventListener("click", () => {
        this.activateTab(i);
      });
      this.tabbarContent.appendChild (e);
    }

    this.tabbar = this.querySelector(".mdc-tab-bar");
    this.mdcComponent = mdc.tabBar.MDCTabBar.attachTo(this.tabbar);
    this.mdcComponent.initialize();

    this.tabbar.addEventListener("MDCTabBar:activated", (e) => {
      this.dispatchEvent(new CustomEvent("change", { detail : e.detail.index }))
      var e = this.items[e.detail.index];
      if (e) {
        e.dispatchEvent(new CustomEvent("activated", { detail : null }));
      }
    });

    if (this._activeTab >= 0) {
      this.mdcComponent.activateTab(this._activeTab);
    }
  }

  clearItems() {
    this.items = [];
    if (this.tabbarContent) {
      this.tabbarContent.innerHTML = ``;
    }
  }
  
  activateTab (index) {
    this._activeTab = index;
    if (this.mdcComponent) {
      this.mdcComponent.activateTab(this._activeTab);
    }
  }

  addTab(icon, text) {
    var e = document.createElement("button");
    e.className = "mdc-tab";
    e.role = "tab";
    e.ariaSelected = "true";
    e.tabindex = this.items.length;
    e.innerHTML = `
          <span class="mdc-tab__content">
            <span class="mdc-tab__icon material-icons" aria-hidden="true">${icon}</span>
            <span class="mdc-tab__text-label">${text}</span>
          </span>
          <span class="mdc-tab-indicator">
            <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
          </span>
          <span class="mdc-tab__ripple"></span>
          <div class="mdc-tab__focus-ring"></div>`;
    return this.addElement(e);
  }

  addElement(li) {
    if (this.tabbarContent) {
      li.addEventListener("click", () => {
        this.activateTab(li.tabindex);
      });
      this.tabbarContent.appendChild (li);
      this.mdcComponent.initialize();
    }
    this.items.push(li);
    return li;
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
  }
}

window.customElements.define("cc-mdc-tabbar", CcMdcTabbar);
