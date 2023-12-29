class CcDrawing extends HTMLElement {
  constructor() {
    super();
    this.style.display = "inline-block";
  }
  
  connectedCallback () {
    setTimeout(() => {
      this.connectedCallbackStep2();
    }, 0);
  }
  
  connectedCallbackStep2 () {
    this.init();
  }

  init() {
    var label = this._label || this.getAttribute("label") || "";
    this.labelDiv = document.createElement("div");
    this.labelDiv.style.padding = "0px";
    this.labelDiv.style.margin = "5px";
    this.labelDiv.style.fontSize = "12px";
    this.labelDiv.style.color = "rgba(0, 0, 0, 0.38)";
    this.labelDiv.innerText = label;
    this.appendChild(this.labelDiv);

    this.canvas = document.createElement("canvas");
    this.canvas.style.width = this.offsetWidth + "px";
    this.canvas.style.height = (this.offsetHeight - this.labelDiv.offsetHeight) + "px";
    this.canvas.style.border = "1px solid #bbb";
    this.canvas.style.borderRadius = "4px";

    this.canvas.width = this.offsetWidth;
    this.canvas.height = (this.offsetHeight - this.labelDiv.offsetHeight);
    
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineWidth = 2;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#000';
    this.ctx.imageSmoothingEnabled = true;
    
    var mouse = {x: 0, y: 0};

    var targetfun = htmlFunctionArray[this.getAttribute(".target")];
    if (targetfun && targetfun.func && targetfun.func instanceof CcD5cHolder) {
      let d5cholder = targetfun.func;
      d5cholder.addEventListener("d5c_changed", () => {
        this.value = d5cholder.toString();
      })
      this.addEventListener("change", () => {
        d5cholder.setValue(this.value);
      });
      this.value = d5cholder.toString();
    } else if (targetfun && targetfun.func && targetfun.func.__isTarget) {
      var { obj, prop } = targetfun.func();
      this.addEventListener("change", () => {
        obj[prop] = this.value;
      });
      if (isDefined(obj[prop])) {
        this.value = obj[prop];
      }
    }

    var inputfun = htmlFunctionArray[this.getAttribute("@input")];
    if (inputfun) {
      var d = debounce(inputfun.func, 100)
      this.addEventListener("change", d);
    }

    var changefun = htmlFunctionArray[this.getAttribute("@change")];
    if (changefun) {
      var d = debounce(changefun.func, 100)
      this.addEventListener("change", d);
    }

    var onPaintTouch = (e) => {
      let r = this.canvas.getBoundingClientRect();
      let x = e.touches[0].clientX - r.left;
      let y = e.touches[0].clientY - r.top;
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      e.preventDefault();
      
      this.movecount++;
    };

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.ctx.beginPath();
      this.ctx.moveTo(e.offsetX, e.offsetY);
      this.movecount = 0;
      this.canvas.addEventListener('touchmove', onPaintTouch, false);
    }, false);
     
    this.canvas.addEventListener('touchend', () => {
      this.canvas.removeEventListener('touchmove', onPaintTouch, false);
      this.dispatchEvent(new CustomEvent("change", {detail : null}));
    }, false);

    this.canvas.addEventListener('touchcancel', () => {
      this.canvas.removeEventListener('touchmove', onPaintTouch, false);
      this.dispatchEvent(new CustomEvent("change", {detail : null}));
    }, false);

    var onPaintMouse = (e) => {
      this.ctx.lineTo(mouse.x, mouse.y);
      this.ctx.stroke();
      this.movecount++;
    };

    this.canvas.addEventListener('mousemove', (e) => {
      mouse.x = e.offsetX;
      mouse.y = e.offsetY;
    }, false);

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button != 0) {
        return;
      }
      this.movecount = 0;
      this.ctx.beginPath();
      this.ctx.moveTo(mouse.x, mouse.y);
      this.canvas.addEventListener('mousemove', onPaintMouse, false);
    }, false);
     
    this.canvas.addEventListener('mouseup', (e) => {
      if (e.button != 0) {
        return;
      }
      this.canvas.removeEventListener('mousemove', onPaintMouse, false);
      this.dispatchEvent(new CustomEvent("change", {detail : null}));
    }, false);
    
    this.appendChild (this.canvas);

    if (this.imagestring) {
      var img = new Image;
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0);
        this.dispatchEvent(new CustomEvent("contentloaded", {detail : null}));
      };
      img.src = this.imagestring;
    }

    this.style.position = "relative";

    this.toolbar = document.createElement("div");
    this.toolbar.style.position = "absolute";
    this.toolbar.style.top = "10px";
    this.toolbar.style.right = "0px";
    this.toolbar.innerHTML = `<span style="font-size:20px;" class="material-icons">delete_sweep</span>`;
    this.toolbar.querySelector("span").addEventListener("click", () => {
      this.ctx.clearRect(0, 0, this.offsetWidth, this.offsetHeight);
      this.dispatchEvent(new CustomEvent("change", {detail : null}));
    });
    this.appendChild (this.toolbar);
  }
  
  set label (value) {
    this._label = value;
    if (this.labelDiv) {
      this.labelDiv.innerText = value;
    }
  }

  set value(v) {
    if (this.ctx) {
      var img = new Image;
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0);
        this.dispatchEvent(new CustomEvent("contentloaded", {detail : null}));
      };
      img.src = v;
    } else {
      this.imagestring = v;
    }
  }

  get value() {
    return this.canvas.toDataURL("image/png");
  }

  get hasContent() {
    var pixel = 0;
    var imgdata = this.ctx.getImageData(0, 0, this.offsetWidth, this.offsetHeight);
    for(var i = 0; i < imgdata.data.length; i += 4) {
      if (imgdata.data[i + 3] > 0 && imgdata.data[i] < 255) {
        pixel++;
      }
    }
    return pixel > (imgdata.data.length / 1000);
  }
}

window.customElements.define("cc-drawing", CcDrawing);
