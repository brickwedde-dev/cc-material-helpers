class CcTimeline extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.startDate = new Date();
    this.startDate.setMilliseconds(0);
    this.startDate.setSeconds(0);
    this.startDate.setMinutes(0);
    this.startDate.setHours(0);

    this.endDate = new Date(this.startDate.getTime());
    this.endDate.setDate(this.endDate.getDate() - 1);

    this.range = [];
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
    <div>
      <div style="display:inline-block;border-right:1px solid black;" id="y-axis"></div><div style="display:inline-block;" id="content"></div>
    </div>
    <div>
      <div style="display:inline-block;" id="empty"></div><div style="display:inline-block;border-top:1px solid black;" id="x-axis"></div>
    </div>
    `;
    this.render();
    this.fetchRange();
  }

  fetchRange() {
    var start = this.startDate.getTime();
    var end = this.endDate.getTime();

    this.dispatchEvent(new CustomEvent("loadrange", { detail : { start, end }}));
  }

  setData(start, end, range) {
    this.startDate = new Date(start);
    this.endDate = new Date(end);
    this.range = range;

    this.render();
  }

  render() {
  }
}

customElements.define('cc-timeline', CcTimeline);