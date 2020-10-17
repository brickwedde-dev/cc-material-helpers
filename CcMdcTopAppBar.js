
class CcMdcTopAppBar extends HTMLElement {
  constructor(drawer) {
    super();
    this.drawer = drawer;
  }

  connectedCallback() {
    globalLabelCount++;

//    var type = this.getAttribute("type") || "text";
//    var label = this.getAttribute("label") || "Label";

    this.innerHTML = `<header class="mdc-top-app-bar app-bar" id="app-bar">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button">menu</button>
          <span class="mdc-top-app-bar__title"></span>
        </section>
      </div>
    </header>
    <main class="main-content" id="main-content">
      <div class="mdc-top-app-bar--fixed-adjust"></div>
    </main>`;

    this.mdcComponent = mdc.topAppBar.MDCTopAppBar.attachTo(this.childNodes[0]);
    this.mdcComponent.setScrollTarget(document.getElementById('main-content'));
    this.mdcComponent.listen('MDCTopAppBar:nav', () => {
      this.drawer.mdcComponent.open = !this.drawer.mdcComponent.open;
    });

    this.contentElement = this.querySelector(".main-content");
    this.titleElement = this.querySelector(".mdc-top-app-bar__title");
  }

  set titleHTML (s) {
    this.titleElement.innerHTML = s;
  }

  set titleText (s) {
    this.titleElement.innerText = s;
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
  }
}

window.customElements.define("cc-mdc-top-app-bar", CcMdcTopAppBar);
