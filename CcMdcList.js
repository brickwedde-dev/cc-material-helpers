class CcMdcList extends HTMLElement {
  constructor() {
    super();
    this.items = [];
  }

  connectedCallback() {
    this.innerHTML = `<ul class="mdc-list mdc-list--two-line"></ul>`;

    this.ulElem = this.childNodes[0];
    this.mdcComponent = mdc.list.MDCList.attachTo(this.childNodes[0]);

    for (var li of this.items) {
      this.ulElem.appendChild (li);
    }
    this.items = [];
  }

  clearItems() {
    this.items = [];
    if (this.ulElem) {
      this.ulElem.innerHTML = ``;
    }
  }
  
  addItem(html1, html2) {
    var li = new CcMdcListItem2(html1, html2);
    if (this.ulElem) {
      this.ulElem.appendChild (li);
    } else {
      this.items.push(li);
    }
    return li;
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
  }
}

window.customElements.define("cc-mdc-list", CcMdcList);
