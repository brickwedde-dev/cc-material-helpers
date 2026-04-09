class CcMdcLevelIndicator extends HTMLElement {
  constructor() {
    super();
    this._regions = [];
  }

  connectedCallback() {
    this.container = document.createElement("div");
    this.container.style.display = "flex";
    this.container.style.width = "100%";
    this.container.style.height = this.style.height || "20px";
    this.container.style.overflow = "hidden";
    this.appendChild(this.container);

    this.applyValue();
  }

  set value(regions) {
    this._regions = regions || [];
    this.applyValue();
  }

  get value() {
    return this._regions;
  }

  applyValue() {
    if (!this.container) {
      return;
    }
    this.container.innerHTML = "";

    if (this._regions.length === 0) {
      return;
    }

    var max = this._regions[this._regions.length - 1].value;
    var min = this._regions[0].value - ((max - this._regions[0].value) * 0.1);
    if (max <= min) {
      max = min + 1;
    }
    var totalRange = max - min;

    var prevValue = min;
    for (var i = 0; i < this._regions.length; i++) {
      var region = this._regions[i];
      var span = region.value - prevValue;
      if (span < 0) {
        span = 0;
      }
      var widthPercent = (span / totalRange) * 100;

      var segment = document.createElement("div");
      segment.style.width = widthPercent + "%";
      segment.style.height = "100%";
      segment.style.backgroundColor = region.color || "#000000";
      segment.style.flexShrink = "0";
      this.container.appendChild(segment);

      prevValue = region.value;
    }
  }

  disconnectedCallback() {
    this.container = null;
  }
}

window.customElements.define("cc-mdc-level-indicator", CcMdcLevelIndicator);
