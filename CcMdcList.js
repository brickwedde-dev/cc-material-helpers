class CcMdcList extends HTMLElement {
  constructor() {
    super();
    this.items = [];
    this._singleSelection = false;
    this.lines = 2;
    this.dndarrowconfig = null;
    this.dndarrowleft = 0;
  }

  connectedCallback() {
    if (this.getAttribute("lines")) {
      this.lines = parseInt(this.getAttribute("lines"));
    }

    var lineclass = "";
    switch (this.lines) {
      case 2:
        lineclass = "mdc-list--two-line";
    }
    this.innerHTML = `<ul class="mdc-list ${lineclass}"></ul>`;

    this.ulElem = this.childNodes[0];
    this.mdcComponent = mdc.list.MDCList.attachTo(this.childNodes[0]);

    if (this.dndarrowconfig) {
      this.dndarrow = document.createElement("img");
      this.dndarrow.src = this.dndarrowconfig.src;
      this.dndarrow.style = "display:none;position:absolute;left:0px;top:0px;height:30;width:60px;";
      this.insertBefore(this.dndarrow, this.ulElem);
    }

    this.mdcComponent.singleSelection = this._singleSelection;
    for (var li of this.items) {
      this.ulElem.appendChild (li);
    }
  }

  set singleSelection (value) {
    this._singleSelection = value;
    if (this.mdcComponent) {
      this.mdcComponent.singleSelection = this._singleSelection;
    }
  }

  clearItems() {
    this.items = [];
    if (this.ulElem) {
      this.ulElem.innerHTML = ``;
    }
  }
  
  activate (li) {
    for(var l of this.items) {
      l.activated = l == li;
    }
  }

  select (li) {
    for(var l of this.items) {
      l.selected = l == li;
    }
  }

  showDndArrow(li, position) {
    if (!this.dndarrow) {
      return;
    }

    this.dndarrow.style.display = "block";
    var top = li ? li.offsetTop : 0;
    switch (position) {
      case "below":
        top += li ? li.offsetHeight : 0;
        break;
    }
    top -= this.dndarrow.offsetHeight / 2;
    this.dndarrow.style.top = parseInt(top) + "px";

    if (!this.dndarrowani) {
      this.dndarrowani = setInterval(() => {
        this.dndarrowleft += 3;
        if (this.dndarrowleft > this.dndarrow.offsetWidth / 3) {
          this.dndarrowleft = 0;
        }
        this.dndarrow.style.left = this.dndarrowleft + "px";
      }, 100);
    }
  }

  hideDndArrow() {
    if (this.dndarrowani) {
      clearInterval(this.dndarrowani);
      this.dndarrowani = null;
    }
    if (!this.dndarrow) {
      return;
    }
    this.dndarrow.style.display = "none";
  }

  addElement(li) {
    if (this.ulElem) {
      this.ulElem.appendChild (li);
    }
    this.items.push(li);
    return li;
  }

  addItem(html1, html2) {
    var li = new CcMdcListItem2(html1, html2);
    if (this.ulElem) {
      this.ulElem.appendChild (li);
    }
    this.items.push(li);
    return li;
  }

  addItemCallback(fillcb) {
    var li = new CcMdcListItemCb(fillcb);
    if (this.ulElem) {
      this.ulElem.appendChild (li);
    }
    this.items.push(li);
    return li;
  }

  addItemDndCallback(fillcb) {
    var li = new CcMdcListItemDndCb(fillcb);
    if (this.ulElem) {
      this.ulElem.appendChild (li);
    }
    this.items.push(li);
    return li;
  }

  disconnectedCallback() {
    this.mdcComponent.destroy();
    if (this.dndarrowani) {
      clearInterval(this.dndarrowani);
      this.dndarrowani = null;
    }
  }
}

window.customElements.define("cc-mdc-list", CcMdcList);
