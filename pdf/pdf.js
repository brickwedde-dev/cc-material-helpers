const { PDFDocument, StandardFonts, rgb } = PDFLib;

class PdfPage {
  page
  options
  constructor(page, options) {
    this.page = page;
    this.options = options;
  }

  get headerheight() {
    return this.options.headerheight
  }
  get footerheight() {
    return this.options.footerheight
  }
  get height() {
    return this.options.height
  }
  get width() {
    return this.options.width
  }
}

class PdfPages extends EventTarget {

  pages = [];
  constructor (pdfDoc) {
    super();
    this.pdfDoc = pdfDoc;
  }

  getPage(no) {
    return this.getPdfPage(no).page;
  }

  getPdfPage(no) {
    while(this.pages.length < no) {
      var page = this.pdfDoc.addPage();
      const { width, height } = page.getSize();

      var options = { footerheight : 0, headerheight : 0, width, height }

      this.dispatchEvent(new CustomEvent("header", {detail : {page, options, pageno: this.pages.length}}))
      this.dispatchEvent(new CustomEvent("footer", {detail : {page, options, pageno: this.pages.length}}))

      this.pages.push( new PdfPage(page, options));
    }
    var pdfpage = this.pages[no - 1];
    return pdfpage;
  }
}

class PdfState {
  pageNo = 0

  constructor(pages) {
    this.pages = pages;
  }

  start() {
    this.pageNo = 1;
    var pdfpage = this.pdfpage;
    this.top = this.height - pdfpage.headerheight;
  }

  break () {
    this.pageNo++;
    var pdfpage = this.pdfpage;
    this.top = this.height - pdfpage.headerheight;
  }

  breakIfNeeded (textHeight) {
    if (this.top - textHeight < this.pdfpage.footerheight) {
      this.break();
    }
  }

  ends = []
  startPara() {
    var newState = new PdfState(this.pages);
    newState.top = this.top
    newState.pageNo = this.pageNo
    this.ends.push(newState);
    return newState;
  }

  commitTop () {
    var maxPage = -1;
    for(var o of this.ends) {
      if (maxPage < o.pageNo) {
        maxPage = o.pageNo
      }
    }
    var minTop = 9999999;
    for(var o of this.ends) {
      if (maxPage == o.pageNo) {
        if (minTop > o.top) {
          minTop = o.top;
        }
      }
    }
    if (minTop < 9999999 && maxPage > 0) {
      this.top = minTop;
      this.pageNo = maxPage;
    }
    this.ends = [];
  }
  
  get page() {
    return this.pages.getPage(this.pageNo)
  }

  get pdfpage() {
    return this.pages.getPdfPage(this.pageNo)
  }

  get width() {
    return this.pdfpage.width
  }

  get height() {
    return this.pdfpage.height
  }

  para (left, width, text, font, size) {
    var local = this.startPara();
    local.paraLocal (left, width, text, font, size)
  }

  paraLocal (left, width, text, font, size) {
    var testtext = text.replace(/\r\n/g, "\r").replace(/\n/g, "\r");
    var resttext = "";
    var firstfittest = null;
    var firstfitrest = null;

    const textHeight = font.heightAtSize(size);
    do {
      this.breakIfNeeded(textHeight);

      do {
        var br = testtext.indexOf("\r");
        if (br == 0) {
          this.top -= textHeight;
          testtext = testtext.substring(1);
          resttext = "";
          continue;
        }
        if (br > 0) {
          resttext = testtext.substring(br);
          testtext = testtext.substring(0, br);
        }
        const textWidth = font.widthOfTextAtSize(testtext, size);
        if (textWidth <= width) {
          if (!firstfittest) {
            firstfittest = testtext;
            firstfitrest = resttext;
          }
          if (resttext === "" || resttext.charAt(0) == "\r") {
            break;
          }
          var valid = false;
          switch (testtext.charAt(testtext.length - 1)) {
            case "?":
            case "!":
            case ",":
            case " ":
            case "-":
              valid = true;
              break;
          }
          if (valid) {
            break;
          }
        }
        resttext = testtext.slice(-1) + resttext;
        testtext = testtext.substring(0, testtext.length - 1);
      } while (testtext.length > 0);

      if (testtext.length == 0) {
        testtext = firstfittest;
        resttext = firstfitrest;
      }

      firstfittest = null;
      firstfitrest = null;

      if (testtext.length > 0) {
        this.page.drawText(testtext, { x: left, y: this.top, size: size, font: font, color: rgb(0, 0, 0), });
        this.top -= textHeight;

        if (resttext.charAt(0) == "\r") {
          resttext = resttext.substring(1);
        }

        testtext = resttext;
        resttext = "";
      } else {
        break;
      }
    } while (testtext.length > 0);
  };

};

