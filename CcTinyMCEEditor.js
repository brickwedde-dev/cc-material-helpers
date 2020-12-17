class CcTinyMCEEditor extends HTMLElement {
  constructor() {
    super();
    this._disabled = false;
  }

  connectedCallback() {
    this.imagelist = [];
    this.style.display = "inline-block";
    this.innerHTML = `<textarea style="height:100%;width:100%;"></textarea>`;

    tinymce.init( {
      target: this.childNodes[0], 
      plugins: 'autoresize image',
      setup:(ed) => {
        this.editor = ed;
        ed.on('change', (e) => {
          this.dispatchEvent(new CustomEvent("change", { details : null }));
        });
      },
      image_list: this.imagelist,
      automatic_uploads: true,
      file_picker_types: 'image',
      file_picker_callback: function (cb, value, meta) {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
    
        /*
          Note: In modern browsers input[type="file"] is functional without
          even adding it to the DOM, but that might not be the case in some older
          or quirky browsers like IE, so you might want to add it to the DOM
          just in case, and visually hide it. And do not forget do remove it
          once you do not need it anymore.
        */
    
        input.onchange = function () {
          var file = this.files[0];
    
          var reader = new FileReader();
          reader.onload = function () {
            /*
              Note: Now we need to register the blob in TinyMCEs image blob
              registry. In the next release this part hopefully won't be
              necessary, as we are looking to handle it internally.
            */
            var id = 'blobid' + (new Date()).getTime();
            var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
            var base64 = reader.result.split(',')[1];
            var blobInfo = blobCache.create(id, file, base64);
            blobCache.add(blobInfo);
    
            /* call the callback and populate the Title field with the file name */
            cb(blobInfo.blobUri(), { title: file.name });
          };
          reader.readAsDataURL(file);
        };
    
        input.click();
      },
    })
    .then(() => {
      this.applyValue();
      this.applyDisabled();
    });
  }

  set disabled (value) {
    this._disabled = value;
    this.applyDisabled();
  }

  applyDisabled() {
    if (this.editor) {
      if (this._disabled) {
        this.editor.setMode('readonly');
      } else {
        this.editor.setMode('design');
      }
    }
  }

  set value (value) {
    this._value = value;
    this.applyValue();
  }

  get value () {
    if (this.editor) {
      return this.editor.getContent();
    }
    return this._value;
  }

  applyValue() {
    if (this.editor) {
      this.editor.setContent(this._value);
    }
  }

  disconnectedCallback() {
  }
}

window.customElements.define("cc-tinymce-editor", CcTinyMCEEditor);
