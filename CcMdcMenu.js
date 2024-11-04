class CcMdcMenu extends HTMLElement {
  constructor() {
    super();
    this.items = [];
    this._open = false;
    this.skipFocus = false;
  }

  connectedCallback() {
    this.innerHTML = `<div class="mdc-menu mdc-menu-surface">
    <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
    </ul>
  </div>`;

    this.ulElem = this.querySelector("ul");
    this.mdcComponent = mdc.menu.MDCMenu.attachTo(this.childNodes[0]);

    if (this.absoluteXY) {
      this.mdcComponent.setAbsolutePosition (this.absoluteXY.x, this.absoluteXY.y);
      this.mdcComponent.setIsHoisted(true);
    } else if (this.anchor) {
      this.mdcComponent.setAnchorElement(this.anchor);
      this.mdcComponent.setIsHoisted(true);
      this.anchor = null;
    }

    this.mdcComponent.skipFocus = this.skipFocus;

    this.childNodes[0].addEventListener("MDCMenu:selected", (e) => {
      try {
        e.detail.value = JSON.parse(e.detail.item.jsonvalue)
      } catch (e) {
      }
      this.dispatchEvent(new CustomEvent("selected", {detail : e.detail}));
    });

    for (var li of this.items) {
      this.ulElem.appendChild (li);
    }

    this.mdcComponent.open = this._open;
  }

  setAbsolutePosition (x, y) {
    if (this.mdcComponent) {
      this.mdcComponent.setAbsolutePosition (x, y);
      this.mdcComponent.setIsHoisted(true);
    } else {
      this.absoluteXY = {x, y};
    }
  }

  setAnchorElement(anchor) {
    if (this.mdcComponent) {
      this.mdcComponent.setAnchorElement(anchor);
      this.mdcComponent.setIsHoisted(true);
    } else {
      this.anchor = anchor;
    }
  }

  set open (value) {
    this._open = value;
    if (this.mdcComponent) {
      this.mdcComponent.open = this._open;
    }
  }

  clearItems() {
    this.items = [];
    if (this.ulElem) {
      this.ulElem.innerHTML = ``;
    }
  }
  
  addElement(li, value) {
    if (this.ulElem) {
      this.ulElem.appendChild (li);
    }
    li.jsonvalue = JSON.stringify(value);
    this.items.push(li);
    return li;
  }

  addItem(html, value) {
    var li = document.createElement("li");
    li.className="mdc-list-item";
    li.role="menuitem";
    li.innerHTML = `<span class="mdc-list-item__ripple"></span><span class="mdc-list-item__text"></span>`;
    var span = li.querySelector(".mdc-list-item__text");
    if (typeof html == "string") {
      span.innerHTML = html;
    } else if (html instanceof HTMLElement) {
      span.appendChild(html);
    }
    this.addElement(li, value);
    return li;
  }

  addSeparator() {
    var li = document.createElement("li");
    li.className="mdc-list-divider";
    li.role="separator";
    this.addElement(li);
    return li;
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
  }
}

window.customElements.define("cc-mdc-menu", CcMdcMenu);
