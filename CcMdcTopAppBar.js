
class CcMdcTopAppBar extends HTMLElement {
  constructor(drawer) {
    super();
    this.drawer = drawer;
  }

  connectedCallback() {
    globalLabelCount++;

    this.style.display = "block";
    this.style.height = "100%";

//    var type = this.getAttribute("type") || "text";
//    var label = this.getAttribute("label") || "Label";

    this.innerHTML = `<header class="mdc-top-app-bar" style="position:static;">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button">menu_open</button>
          <span class="mdc-top-app-bar__title"></span>
        </section>
        <section id="toolbar" class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
        </section>
      </div>
    </header>
    <main class="main-content" id="main-content" style="top: 64px; bottom: 0px; left: 0px; right: 0px; position: absolute; overflow:auto;">
    </main>`;

    this.mdcComponent = mdc.topAppBar.MDCTopAppBar.attachTo(this.childNodes[0]);
    this.mdcComponent.setScrollTarget(document.getElementById('main-content'));
    this.mdcComponent.listen('MDCTopAppBar:nav', () => {
      this.drawer.mdcComponent.open = !this.drawer.mdcComponent.open;
    });

    this.contentElement = this.querySelector(".main-content");
    this.titleElement = this.querySelector(".mdc-top-app-bar__title");
    this.contextButtons = this.querySelector("#toolbar");
  }

  set titleHTML (s) {
    if (typeof s == "string") {
      this.titleElement.innerHTML = s;
    } else if (s instanceof HTMLElement) {
      this.titleElement.innerHTML = "";
      this.titleElement.appendChild(s);
    }
  }

  set titleText (s) {
    this.titleElement.innerText = s;
  }

  addButton(button) {
    this.contextButtons.appendChild (button);
  }

  clearButtons() {
    this.contextButtons.innerHTML = "";
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
  }
}

window.customElements.define("cc-mdc-top-app-bar", CcMdcTopAppBar);
