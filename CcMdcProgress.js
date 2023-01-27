class CcMdcProgress extends HTMLElement {
  constructor() {
    super();
    this.showCount = 0;
  }

  connectedCallback() {
    this.style = "display:none;position:absolute;top:0px;left:0px;right:0px;bottom:0px;padding-left:calc(50vw - 24px);padding-top:calc(50vh - 24px);background-color:rgba(128,128,128,0.5)";

    var label = this.label || this.getAttribute("label") || "";

    this.innerHTML = html`
<div class="mdc-circular-progress" style="width:48px;height:48px;" role="progressbar" aria-label="${label}" aria-valuemin="0" aria-valuemax="1">
  <div class="mdc-circular-progress__determinate-container">
    <svg class="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle class="mdc-circular-progress__determinate-track" cx="24" cy="24" r="18" stroke-width="4"/>
      <circle class="mdc-circular-progress__determinate-circle" cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="113.097" stroke-width="4"/>
    </svg>
  </div>
  <div class="mdc-circular-progress__indeterminate-container">
    <div class="mdc-circular-progress__spinner-layer mdc-circular-progress__color-1">
      <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"/>
        </svg>
      </div>
      <div class="mdc-circular-progress__gap-patch">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="3.8"/>
        </svg>
      </div>
      <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"/>
        </svg>
      </div>
    </div>

    <div class="mdc-circular-progress__spinner-layer mdc-circular-progress__color-2">
      <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"/>
        </svg>
      </div>
      <div class="mdc-circular-progress__gap-patch">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="3.8"/>
        </svg>
      </div>
      <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"/>
        </svg>
      </div>
    </div>

    <div class="mdc-circular-progress__spinner-layer mdc-circular-progress__color-3">
      <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"/>
        </svg>
      </div>
      <div class="mdc-circular-progress__gap-patch">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="3.8"/>
        </svg>
      </div>
      <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"/>
        </svg>
      </div>
    </div>

    <div class="mdc-circular-progress__spinner-layer mdc-circular-progress__color-4">
      <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"/>
        </svg>
      </div>
      <div class="mdc-circular-progress__gap-patch">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="3.8"/>
        </svg>
      </div>
      <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"/>
        </svg>
      </div>
    </div>
  </div>
</div>
`;

    this.progressDiv = this.querySelector(".mdc-circular-progress");;
    this.mdcComponent = mdc.circularProgress.MDCCircularProgress.attachTo(this.progressDiv);
    this.mdcComponent.foundation.setDeterminate(false);
    if (this.showCount > 0) {
      this.mdcComponent.open();
      this.style.display = "block";
    }
  }

  show() {
    this.showCount++;
    this.style.display = "block";
    if (this.mdcComponent) {
      this.mdcComponent.open();
    }
  }

  hide() {
    this.showCount--;
    if (this.showCount <= 0) {
      this.style.display = "none";
      if (this.mdcComponent) {
        this.mdcComponent.close();
      }
    }
  }

  disconnectedCallback() {
    if (this.mdcComponent) {
      this.mdcComponent.close();
      this.mdcComponent.destroy();
    }
  }
}

window.customElements.define("cc-mdc-progress", CcMdcProgress);
