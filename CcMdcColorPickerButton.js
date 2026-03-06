class CcMdcColorPickerButton extends HTMLElement {
  constructor() {
    super();
    this._disabled = false;
    this.aAvailableColors = undefined;
    this.empty = false;
  }

  connectedCallback() {
    this.colorPickerButton = document.createElement("i");
    this.colorPickerButton.style.display = "inline-block";
    this.colorPickerButton.style.textAlign = "center";
    this.colorPickerButton.style.fontSize = "10px";
    this.colorPickerButton.style.width = "80px";
    this.colorPickerButton.style.height = "18px";
    this.colorPickerButton.style.lineHeight = "18px";
    this.colorPickerButton.style.borderRadius = "9px";
    this.colorPickerButton.style.border = "1px solid black";
    this.colorPickerButton.style.cursor = "pointer";
    this.colorPickerButton.addEventListener("click", (e) => {
      var color2 = getColorDefault(this._value, "#00000000").toUpperCase();
      ColorPickerDlg(t9n`color picker`, color2, { resourcetype : "customcolortransparent", transparent : this.transparent, empty : this.empty }, this.aAvailableColors)
      .then((color) => {
        this._value = color.hex;
        this.dispatchEvent(new CustomEvent("change", { detail : this._value }));
        this.applyValue();
      })
      .catch((e) => {
        console.error(e)
      });
      e.stopPropagation();
      e.preventDefault();
    });
    this.appendChild(this.colorPickerButton);

    this.applyValue();
    this.applyDisabled();
  }

  set disabled (value) {
    this._disabled = value;
    this.applyDisabled();
  }

  applyDisabled() {
    if (this.colorPickerButton) {
      if (this._disabled) {
        this.colorPickerButton.disabled = true;
      } else {
        this.colorPickerButton.disabled = false;
      }
    }
  }

  set value (value) {
    this._value = value;
    this.applyValue();
  }

  get value () {
    return this._value;
  }

  applyValue() {
    var color = getColorDefault(this._value, "#00000000").toUpperCase();
    var textcolor = "white";
    var values = color.match(/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?$/);
    if (values) {
      if (parseInt(values[1], 16) + parseInt(values[2], 16) + parseInt(values[3], 16) > 128 * 3 || (values.length > 4 && parseInt(values[4], 16) < 128)) {
        textcolor = "black";
      }
    }
    if (this.colorPickerButton) {
      this.colorPickerButton.innerText = (isColorTransparent(color) && this.empty) ? "------" : color;
      this.colorPickerButton.style.color = textcolor;
      this.colorPickerButton.style.backgroundColor = color;
    }
  }

  disconnectedCallback() {
    this.colorPickerButton = null;
  }
}

window.customElements.define("cc-mdc-color-picker-button", CcMdcColorPickerButton);

function ColorPickerDlg(title, selectedcolor, options, aAvailableColors) {
  return new Promise((resolve, reject) => {
    var oInfo = { picker : null, hexcolor : getColor(selectedcolor), };
    var dlg = new CcMdcDialog();
    dlg.setFillContentFunction((dlgContent) => {

      var input;
      var updateValue;
      if (options.empty) {
        var emptyBtn = new CcMdcButton();
        emptyBtn.setIcon("delete");
        emptyBtn.setActionbar(true);
        emptyBtn.addEventListener("click", () => {
          resolve("");
          dlg.close();
        });
        dlgContent.appendChild(emptyBtn);
      }
      if (aAvailableColors) {
        input = new CcMdcSelect();
        input.width = 240;
        input.menuContainerMinWidth = 240;
        var res = {};
        var doSort = false;
        updateValue = () => {
          if (oInfo.hexcolorLast == oInfo.hexcolor) {
            return;
          }
          oInfo.hexcolorLast = oInfo.hexcolor;

          input.removeItems();

          var selColor = oInfo.hexcolor;
          for(var m in res) {
            if (oInfo.hexcolor == res[m].htmlvalue.toLowerCase() || oInfo.hexcolor == res[m].htmlvalue.toLowerCase() + "ff") {
              selColor = res[m].value;
            }
          }

          res = JSON.parse(JSON.stringify(aAvailableColors));
          if (options.transparent) {
            res["colorUnsichtbar"] = { name : t9n`Transparent`, value : "colorUnsichtbar", htmlvalue : "#00000000"};
          } else if (options.empty) {
            res["colorUnsichtbar"] = { name : t9n`Keine Farbe`, value : "colorUnsichtbar", htmlvalue : "#00000000"};
          }

          var bFound = false;
          for(var m in res) {
            if (selColor == res[m].value) {
              bFound = true;
              continue;
            }
            if (res[m].value.substring(0, 3) == "clr" || ((options.transparent || options.empty) && res[m].value == "colorUnsichtbar")) {
              continue;
            }
            // remove non matching and not used colors
            delete res[m];
          }

          if (oInfo.hexcolor && !bFound) {
            //res[oInfo.hexcolor] = { name : t9n`Eigene Farbe ` + " " + oInfo.hexcolor, value : oInfo.hexcolor, htmlvalue : oInfo.hexcolor};
          }

          var selected = false;
          for(var m in res) {
            if (selColor == res[m].value) {
              selected = true;
            }
          }
          if (!selected) {
            input.addItem(t9n`Eigene Farbe '${oInfo.hexcolor}'`, oInfo.hexcolor, true/*ignoreLayoutOptions*/);
            input.selectedIndex = 0;
          }
          if (doSort) {
            var keys = Object.keys(res);
            keys.sort((a, b) => {
              return res[a].name.localeCompare(res[b].name);
            });
            for(var m of keys) {
              input.addItem(res[m].name.escapeXml(), res[m].value, true/*ignoreLayoutOptions*/);
            }
          } else {
            for(var m in res) {
              input.addItem(res[m].name.escapeXml(), res[m].value, true/*ignoreLayoutOptions*/);
            }
          }

          input.layoutOptions();

          input.value = selColor;
        }

        updateValue();

        input.addEventListener("change", (e) => {
          var v = e.target.value;
          if (oInfo.hexcolor != v) {
            oInfo.hexcolor = getColor(v).toLowerCase();
            if (oInfo.hexcolor == "#00000000" && options.empty) {
              oInfo.color = "";
              oInfo.hexcolor = "";
            }
            if (oInfo.picker) {
              oInfo.picker.setColor(oInfo.hexcolor);
            }
          }
        });
        dlgContent.appendChild(input);
      }

      oInfo.picker = new Picker({
          parent: dlgContent,
          popup: false,
          alpha: options.transparent,
          editor: true,
          color: selectedcolor,
          onChange: function(color) {
              oInfo.color = color;
              oInfo.hexcolor = color.hex;
              if (updateValue) {
                updateValue();
              }
          },
      });
    });
    dlg.type = "okcancel";
    dlg.open()
    .then((x) => {
      switch (x) {
        case "ok":
          resolve(oInfo.color);
          break;
        case "cancel":
          reject("cancel");
          break;
      }
    })
    .catch((e) => {
      reject(e);
    });
  });
}
