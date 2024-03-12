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

  para (left, width, text, font, size, options) {
    var local = this.startPara();
    local.paraLocal (left, width, text, font, size, options)
  }

  paraLocal (totalleft, totalwidth, text, font, size, options) {
    var testtext = text.replace(/\r\n/g, "\r").replace(/\n/g, "\r");
    var resttext = "";
    var firstfittest = null;
    var firstfitrest = null;

    const textHeightOrig = font.heightAtSize(size, {descender : true});
    const textHeight = font.heightAtSize(size, {descender : true}) * 1.3;

    var width = totalwidth - ((options.paddingLeft || textHeight * 0.5) + (options.paddingRight || textHeight * 0.5) + ((options.padding || 0) * 2));
    var left = totalleft + ((options.paddingLeft || textHeight * 0.5) + (options.padding || 0));

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
        if (options.background) {
          this.page.drawRectangle({x: totalleft, y: this.top - textHeight, width: totalwidth, height: textHeight, color: options.background,})
        }
        switch (options.align) {
          case "left":
          default:
            this.page.drawText(testtext, { x: left, y: this.top - textHeightOrig, size, font, color : options.color || rgb(0, 0, 0), });
            break;
          case "center":
            var textWidth = font.widthOfTextAtSize(testtext, size);
            this.page.drawText(testtext, { x: left + ((width - textWidth) / 2), y: this.top - textHeightOrig, size, font, color : options.color || rgb(0, 0, 0), });
            break;
          case "right":
            var textWidth = font.widthOfTextAtSize(testtext, size);
            this.page.drawText(testtext, { x: left + width - textWidth, y: this.top - textHeightOrig, size, font, color : options.color || rgb(0, 0, 0), });
            break;
        }
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

  paraBox (totalleft, totalwidth, text, font, size, options) {
    var local = this.startPara();
    return local.paraBoxLocal (totalleft, totalwidth, text, font, size, options)
  }
  
  paraBoxLocal (totalleft, totalwidth, text, font, size, options) {
    var testtext = text.replace(/\r\n/g, "\r").replace(/\n/g, "\r");
    var resttext = "";
    var firstfittest = null;
    var firstfitrest = null;

    var firstpage = this.pageNo
    var firsttop = this.top
    var texts = []

    const textHeightOrig = font.heightAtSize(size, {descender : true});
    const textHeight = font.heightAtSize(size, {descender : true}) * 1.3;

    var width = totalwidth - ((options.paddingLeft || textHeight * 0.5) + (options.paddingRight || textHeight * 0.5) + ((options.padding || 0) * 2));
    var left = totalleft + ((options.paddingLeft || textHeight * 0.5) + (options.padding || 0));

    if (width > 0) {
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

          var jj = testtext.length - 1;

          var tt = textWidth / (width || 1);
          if (tt > 3) {
            // text is 3 times wider -> half it
            jj = Math.ceil(jj / (tt * 0.5));
          }

          // optimized search
          while(jj > 1) {
            switch (testtext.charAt(jj - 1)) {
              case "?":
              case "!":
              case ",":
              case " ":
              case "-":
                var rem = testtext.slice(jj - testtext.length);
                resttext = rem + resttext;
                testtext = testtext.substring(0, jj);
                jj = -1;
                break;
            }
            jj--;
          }
          if (jj == -2) {
            // found optimized valid position
            continue;
          }

          // char by char fallback
          resttext = testtext.slice(-1) + resttext;
          testtext = testtext.substring(0, testtext.length - 1);
        } while (testtext.length > 0);

        if (testtext.length == 0) {
          testtext = firstfittest;
          resttext = firstfitrest;
        }

        firstfittest = null;
        firstfitrest = null;

        if (isDefined(testtext) && testtext.length > 0) {
          let page = this.page
          let top = this.top;
          let text = testtext;
          let textWidth = font.widthOfTextAtSize(text, size);
          switch (options.align) {
            case "left":
            default:
              texts.push(() => {
                page.drawText(text, { x: left, y: top - textHeightOrig, size, font, color : options.color || rgb(0, 0, 0), });
              })
              break;
            case "center":
              texts.push(() => {
                page.drawText(text, { x: left + ((width - textWidth) / 2), y: top - textHeightOrig, size, font, color : options.color || rgb(0, 0, 0), });
              })
              break;
            case "right":
              texts.push(() => {
                page.drawText(text, { x: left + width - textWidth, y: top - textHeightOrig, size, font, color : options.color || rgb(0, 0, 0), });
              })
              break;
          }

          this.top -= textHeight;

          if (resttext.charAt(0) == "\r") {
            resttext = resttext.substring(1);
          }

          testtext = resttext;
          resttext = "";
        } else {
          break;
        }
      } while (isDefined(testtext) && testtext.length > 0);
    }

    var lastpage = this.pageNo
    var lasttop = this.top
    return { firstpage, lastpage, firsttop, lasttop, texts, totalleft, totalwidth, options }
  };

  renderBoxes(boxes) {
    var firstpage = 99999;
    var lastpage = -1;
    var firsttop = -1;
    var lasttop = 99999;
    for(var box of boxes) {
      if (firstpage > box.firstpage) {
        firstpage = box.firstpage
      }
      if (lastpage < box.lastpage) {
        lastpage = box.lastpage
      }
    }
    for(var box of boxes) {
      if (box.firstpage == firstpage) {
        if (firsttop < box.firsttop) {
          firsttop = box.firsttop
        }
      }
      if (box.lastpage == lastpage) {
        if (lasttop > box.lasttop) {
          lasttop = box.lasttop
        }
      }
    }
    
    if (firstpage == 99999 || lastpage == -1 || firsttop == -1 || lasttop == 99999) {
      return;
    }

    for(var i = firstpage; i <= lastpage; i++) {
      var pdfpage = this.pages.getPdfPage(i);
      var page = pdfpage.page;
      for(var box of boxes) {
        if (box.options.background) {
          if (i == firstpage && i == lastpage) {
            page.drawRectangle({x: box.totalleft, y: lasttop, width: box.totalwidth, height: firsttop - lasttop, color: box.options.background,})
          } else if (i == firstpage) {
            page.drawRectangle({x: box.totalleft, y: pdfpage.footerheight, width: box.totalwidth, height: firsttop - pdfpage.footerheight, color: box.options.background,})
          } else if (i == lastpage) {
            page.drawRectangle({x: box.totalleft, y: lasttop, width: box.totalwidth, height: pdfpage.height - (pdfpage.headerheight + lasttop), color: box.options.background,})
          } else  {
            page.drawRectangle({x: box.totalleft, y: pdfpage.footerheight, width: box.totalwidth, height: pdfpage.height - (pdfpage.headerheight + pdfpage.footerheight), color: box.options.background,})
          }
        }
      }
    }
    for(var box of boxes) {
      for(var t of box.texts) {
        t();
      }
    }

    this.pageNo = lastpage;
    this.top = lasttop;
    return { firstpage, lastpage, firsttop, lasttop, texts : [], totalleft : 0, totalwidth : 0, options : {} }
  }

};

