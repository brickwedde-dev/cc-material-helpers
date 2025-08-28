class CcMdcTableChooser extends HTMLElement {

  #renderCount = 0;

  constructor() {
    super();
    this._label = "";
    this._value = undefined;
    this._disabled = false;

    this.items = {
      headers : [],
      content : [],
    };
  }

  set disabled (value) {
    this._disabled = value;
    this.applyDisabled();
  }

  applyDisabled() {
  }
  
  set value (value) {
    this._value = value;
    if (this.bigtable) {
      this.bigtable.fillRows ();
    }
  }

  get value () {
    try {
      if (this._value) {
        return this._value;
      }
    } catch (e) {}
    return undefined;
  }

  set label (value) {
    this._label = value;
    if (this.bigtable) {
      this.bigtable.fillRows ();
    }
  }

  connectedCallback() {
    this._disabled = this.getAttribute("disabled") ? true : false;

    var label = this._label || this.getAttribute("label") || "";

    this.innerHTML = html`
      <cc-big-table style="width:100%;height:100%;display:inline-block;"></cc-big-table>
    `;
    this.bigtable = this.querySelector("cc-big-table");
    this.bigtable.cellrenderer = (rowelem, colelem, datacol, datarow, uiRowIndex, uiColIndex) => {
      let row = datarow.data;

      colelem.style.verticalAlign = "middle";
      colelem.style.lineHeight = "30px";

      if (row.id !== undefined && row.id == this._value) {
        rowelem.style.backgroundColor = "#2c2";
      } else {
        rowelem.style.backgroundColor = (uiRowIndex % 2) ? "#eee" : "#ddd";
      }
      rowelem.style.borderBottom = "0px solid #000";
      rowelem.uiRowIndex = uiRowIndex;
      rowelem.ROW = true;

      colelem.innerText = row.cells && row.cells[uiColIndex] && row.cells[uiColIndex].name ? row.cells[uiColIndex].name : "";
    }

    this.bigtable.data = [];
    this.bigtable.headerDef = {
      cols : [
      ],
    };
    this.bigtable.fillRows ();

    this.bigtable.addEventListener("click", (e) => {
      var target = e.target
      while(!target.ROW) {
        target = target.parentElement;
      }
      if (target.ROW) {
        if (this.bigtable.data[target.uiRowIndex].data.id !== undefined) {
          this.value = this.bigtable.data[target.uiRowIndex].data.id;
        }
      }
    });

    var changefun = this.getAttribute("@change");
    if (htmlFunctionArray[changefun]) {
      let fun = htmlFunctionArray[changefun];
      this.addEventListener("change", (e) => {setTimeout(() => {fun.func(e)},0)});
    }

    var targetfun = htmlFunctionArray[this.getAttribute(".target")];
    if (targetfun && targetfun.func && targetfun.func instanceof CcD5cHolder) {
      let d5cholder = targetfun.func;
      d5cholder.addEventListener("d5c_changed", () => {
        if (this.value != d5cholder.toString()) {
          this.value = d5cholder.toString();
        }
      })
      this.addEventListener("change", () => {
        d5cholder.setValue(this.value);
      });
      this.value = d5cholder.toString();
    } else if (targetfun && targetfun.func && targetfun.func.__isTarget) {
      let { obj, prop } = targetfun.func();
      this.addEventListener("change", () => {
        obj[prop] = this.value;
      });
      if (isDefined(obj[prop])) {
        this.value = obj[prop];
      }
    }

    var targetfun = this.getAttribute(".options");
    if (htmlFunctionArray[targetfun] && htmlFunctionArray[targetfun].func && htmlFunctionArray[targetfun].func.__isOptions) {
      try {
        let obj = htmlFunctionArray[targetfun].func();
        if (obj instanceof Array) {
          this.addItems(obj);
        } else if (obj instanceof Function || obj instanceof Promise) {
          var fetcher = obj();
          fetcher
          .then((results) => {
            results = JSON.parse(JSON.stringify(results));
            this.addItems(results);
          })
          .catch(()=>{
          });
        }
      } catch (e) {
      }
    }
  }

  disconnectedCallback() {
  }

  setItems(items) {
    this.items = items;
    this.applyItems();
  }

  applyItems()
  {
    if (this.bigtable) {
      this.bigtable.data = [new CcBigTableDataRow(false, true, 30, { cells : this.items.headers })];
      this.bigtable.headerDef = {
        cols : [
        ],
      };
      for (var i = 0; i < this.items.headers.length; i++) {
        this.bigtable.headerDef.cols.push(new CcBigTableDataCol(false, false, this.items.headers[i].width || 100));
      }

      for (var i = 0; i < this.items.content.length; i++) {
        this.bigtable.data.push (new CcBigTableDataRow(false, false, 30, this.items.content[i]));
      }

      this.bigtable.fillRows ();
    }
  }
}

window.customElements.define("cc-mdc-table-chooser", CcMdcTableChooser);
