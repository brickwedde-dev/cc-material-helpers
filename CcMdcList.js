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
    this.innerHTML = html`<ul class="mdc-list ${lineclass}"></ul>`;

    this.ulElem = this.childNodes[0];
    this.mdcComponent = mdc.list.MDCList.attachTo(this.childNodes[0]);

    if (this.dndarrowconfig) {
      if (this.dndarrowconfig.src) {
        this.dndarrow = document.createElement("img");
        this.dndarrow.src = this.dndarrowconfig.src;
        this.dndarrow.style = "display:none;position:absolute;left:0px;top:0px;height:30;width:60px;";
        this.insertBefore(this.dndarrow, this.ulElem);
      } else if (this.dndarrowconfig.leftsrc || this.dndarrowconfig.middlesrc || this.dndarrowconfig.rightsrc) {
        this.dndarrow = document.createElement("div");
        this.dndarrow.style = "display:none;position:absolute;left:0px;top:0px;height:" + (this.dndarrowconfig.height || "30px") + ";width:" + (this.dndarrowconfig.width || "100%") + ";";
        this.insertBefore(this.dndarrow, this.ulElem);
        var leftoffset = 0;
        if (this.dndarrowconfig.leftsrc) {
          var left = document.createElement("img");
          left.src = this.dndarrowconfig.leftsrc;
          left.style.position = "absolute";
          left.style.top = "0px";
          left.style.left = "0px";
          left.style.height = "100%";
          left.style.width = this.dndarrowconfig.leftwidth + "px";
          this.dndarrow.appendChild(left);
          leftoffset = this.dndarrowconfig.leftwidth;
        }
        var rightoffset = 0;
        if (this.dndarrowconfig.rightsrc) {
          var right = document.createElement("img");
          right.src = this.dndarrowconfig.rightsrc;
          right.style.position = "absolute";
          right.style.top = "0px";
          right.style.right = "0px";
          right.style.height = "100%";
          right.style.width = this.dndarrowconfig.rightwidth + "px";
          this.dndarrow.appendChild(right);
          rightoffset = this.dndarrowconfig.rightwidth;
        }
        if (this.dndarrowconfig.middlesrc) {
          var middle = document.createElement("img");
          middle.src = this.dndarrowconfig.middlesrc;
          middle.style.position = "absolute";
          middle.style.top = "0px";
          middle.style.height = "100%";
          middle.style.left = leftoffset + "px";
          middle.style.width = "calc(100% - " + (leftoffset + rightoffset) + "px)";
          this.dndarrow.appendChild(middle);
        }
      }
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
      case "above":
        break;
      case "center":
        top += li ? li.offsetHeight / 2: 0;
        break;
      case "below":
        top += li ? li.offsetHeight : 0;
        break;
    }
    top -= this.dndarrow.offsetHeight / 2;
    this.dndarrow.style.top = parseInt(top) + "px";

    if (!this.dndarrowani) {
/*      this.dndarrowani = setInterval(() => {
        this.dndarrowleft += 3;
        if (this.dndarrowleft > this.dndarrow.offsetWidth / 3) {
          this.dndarrowleft = 0;
        }
        this.dndarrow.style.left = this.dndarrowleft + "px";
      }, 100);*/
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
    var li = document.createElement('li', { is: "cc-mdc-list-item2" });
    li._html1 = html1;
    li._html2 = html2;
    if (this.ulElem) {
      this.ulElem.appendChild (li);
    }
    this.items.push(li);
    return li;
  }

  addItemCallback(fillcb) {
    var li = document.createElement('li', { is: "cc-mdc-list-item-cb" });
    li.fillcb = fillcb;
    if (this.ulElem) {
      this.ulElem.appendChild (li);
    }
    this.items.push(li);
    return li;
  }

  addItemDndCallback(fillcb, draggable) {
    var li = new CcMdcListItemDndCb(fillcb, draggable);
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
