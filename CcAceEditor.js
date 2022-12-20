class CcAceEditor extends HTMLElement {
  constructor() {
    super();
    this._disabled = false;
  }

  connectedCallback() {
    this.style.display = "inline-block";
    this.style.position = "relative";

    if (isDefined(this.getAttribute("disabled"))) {
      this._disabled = this.getAttribute("disabled");
    }

    if (!this.innerHTML) {
      this.innerHTML = `<div style="height:100%;width:100%;"></div>`;
    }
    this.editor = ace.edit(this.childNodes[0]);
    this.editor.setTheme("ace/theme/sqlserver");
    this.editor.session.setMode("ace/mode/xml");

    this.applyValue();
    this.applyDisabled();
  }

  set disabled (value) {
    this._disabled = value;
    this.applyDisabled();
  }

  applyDisabled() {
    if (this.editor) {
      if (this._disabled) {
        this.editor.setReadOnly(true);
      } else {
        this.editor.setReadOnly(false);
      }
    }
  }

  set value (value) {
    this._value = value;
    this.applyValue();
  }

  get value () {
    if (this.editor) {
      return this.editor.getValue();
    }
    return this._value;
  }

  applyValue() {
    if (this.editor && isDefined(this._value)) {
      this.editor.setValue(this._value, -1);
    }
  }

  disconnectedCallback() {
    if (this.editor) {
      this.editor.destroy();
    }
  }
}

window.customElements.define("cc-ace-editor", CcAceEditor);
