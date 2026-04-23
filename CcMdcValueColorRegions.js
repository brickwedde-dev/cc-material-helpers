class CcMdcValueColorRegions extends HTMLElement {
  constructor() {
    super();
    this._regions = [];
    this._disabled = false;
  }

  connectedCallback() {
    this.addBtn = new CcMdcButton();
    this.addBtn.setIcon("add");
    this.addBtn.setActionbar(true);
    this.addBtn.addEventListener("click", () => {
      var maxValue = 0;
      for (let i = 0; i < this._regions.length; i++) {
        var region = this._regions[i];
        if (region.value > maxValue) {
          maxValue = region.value;
        }
      }

      this._regions.push({ value: maxValue + 1, color: "#000000" });
      this.sortRegions();
      this.applyValue();
      this.dispatchEvent(new CustomEvent("change"));
    });
    this.appendChild(this.addBtn);


    this.rowsContainer = document.createElement("div");
    this.appendChild(this.rowsContainer);

    this.levelIndicator = new CcMdcLevelIndicator();
    this.levelIndicator.style.display = "block";
    this.levelIndicator.style.width = "100%";
    this.levelIndicator.style.height = "20px";
    this.levelIndicator.style.marginTop = "8px";
    this.appendChild(this.levelIndicator);

    this.applyValue();
    this.applyDisabled();
  }

  set value(stringifiedJson) {
    try {
      this._regions = JSON.parse(stringifiedJson) || [];
    } catch (e) {
      this._regions = [];
    }
    this.sortRegions();
    this.applyValue();
  }

  get value() {
    return JSON.stringify(this._regions);
  }

  set disabled(value) {
    this._disabled = value;
    this.applyDisabled();
  }

  sortRegions() {
    this._regions.sort(function (a, b) {
      return a.value - b.value;
    });
  }

  applyDisabled() {
    if (this.addBtn) {
      this.addBtn.disabled = this._disabled;
    }
  }

  applyValue() {
    if (!this.rowsContainer) {
      return;
    }
    this.rowsContainer.innerHTML = "";

    for (let i = 0; i < this._regions.length; i++) {
      var region = this._regions[i];
      var row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.marginBottom = "4px";

      var textField = new CcMdcTextField();
      textField.label = t9n`Wert <=`;
      textField.type = "number";
      textField.style.width = "120px";
      (function (idx, tf) {
        tf.addEventListener("change", function () {
          this._regions[idx].value = parseFloat(tf.value) || 0;
          this.sortRegions();
          this.applyValue();
          this.dispatchEvent(new CustomEvent("change"));
        }.bind(this));
      }).call(this, i, textField);
      row.appendChild(textField);

      var thenLabel = document.createElement("span");
      thenLabel.textContent = t9n`dann`;
      row.appendChild(thenLabel);

      let colorPicker = new CcMdcColorPickerButton();
      colorPicker.addEventListener("change", () => {
        this._regions[i].color = colorPicker.value;
        this.updateLevelIndicator();
        this.dispatchEvent(new CustomEvent("change"));
      });
      row.appendChild(colorPicker);

      let deleteBtn = new CcMdcButton();
      deleteBtn.setIcon("delete");
      deleteBtn.setActionbar(true);
      deleteBtn.addEventListener("click", () => {
        this._regions.splice(i, 1);
        this.applyValue();
        this.dispatchEvent(new CustomEvent("change"));
      });
      row.appendChild(deleteBtn);

      this.rowsContainer.appendChild(row);

      textField.value = region.value;
      colorPicker.value = region.color;

      if (this._disabled) {
        textField.disabled = true;
        colorPicker.disabled = true;
        deleteBtn.disabled = true;
      }
    }

    this.updateLevelIndicator();
  }

  updateLevelIndicator() {
    if (this.levelIndicator) {
      this.levelIndicator.value = this._regions;
    }
  }

  disconnectedCallback() {
    this.rowsContainer = null;
    this.addBtn = null;
    this.levelIndicator = null;
  }
}

window.customElements.define("cc-mdc-value-color-regions", CcMdcValueColorRegions);
