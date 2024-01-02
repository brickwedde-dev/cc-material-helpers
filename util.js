function isDefined(v) {
  if (v === null) {
    return false;
  }
  var t = typeof v;
  return t != "null" && t != "undefined" && t != "void";
}

JSON.parseAndCheckOrDefault = function parseAndCheckOrDefault (x, compareType, defaultValue) {
  try {
    if (isDefined(x) && x !== "") {
      var o = JSON.parse(x);
      if (o instanceof compareType) {
        return o;
      }
    }
  } catch {
  }
  return defaultValue;
};

HTMLElement.prototype.addD5cTranslation = function HTMLElement__addD5cTranslation(property, value) {
  if (!this.d5cTranslations) {
    Object.defineProperty(this, "d5cTranslations", {
      value: {},
      writable: true,
      enumerable: false,
    });
  }
  this.d5cTranslations[property] = value;
  return this
}

HTMLElement.prototype.addD5cProp = function HTMLElement__addD5cProp(property, value) {
  if (value instanceof CcD5cHolder) {
    value.addEventListener("d5c_changed", () => {
      this[property] = value.toString();
    });
  }
  this[property] = (value && value.toString) ? value.toString() : value;
  return this
}

Text.prototype.addD5cProp = function Text__addD5cProp(value) {
  if (value instanceof CcD5cHolder) {
    value.addEventListener("d5c_changed", () => {
      this["textContent"] = value.toString();
    });
  }
  this["textContent"] = (value && value.toString) ? value.toString() : value;
  return this
}

HTMLElement.prototype.addD5cAttr = function HTMLElement__addD5cAttr(attribute, value) {
  if (value instanceof CcD5cHolder) {
    value.addEventListener("d5c_changed", () => {
      this.setAttribute(attribute, value.toString());
    });
  }
  this.setAttribute(attribute, value.toString());
  return this
}

HTMLElement.prototype.setChildren = function HTMLElement__setChildren(...childNodes) {
  this.innerHTML = "";
  this.appendChildren(...childNodes)
  return this;
}

HTMLElement.prototype.appendChildren = function HTMLElement__appendChildren(...childNodes) {
  for(var children of childNodes) {
    if (children instanceof String || typeof children == "string") {
      this.appendHTML(children);
    } else if (children instanceof HTMLElement) {
      this.appendChild(children);
    } else if(children instanceof Array) {
      for(var i = 0; i < children.length; i++) {
        if (children[i] instanceof String || typeof children[i] == "string") {
          this.appendHTML(children[i]);
        } else {
          this.appendChild(children[i]);
        }
      }
    }
  }
  return this;
}

HTMLElement.prototype.appendHTML = function HTMLElement__appendHTML(html, cleanup = false) {
  var r = [];
  var div = document.createElement("div");
  div.innerHTML = html;
  while(div.childNodes.length > 0) {
    var e = div.childNodes[0];
    if (cleanup && e instanceof Text && e.textContent.trim().length == 0) {
      div.removeChild(e);
      continue;
    }
    r.push(this.appendChild(e));
  }
  return r.length == 1 ? r[0] : r;
}

function elementsFromHTML(html) {
  var div = document.createElement("div");
  div.innerHTML = html;
  for(var i = div.childNodes.length - 1; i >= 0; i--) {
    var e = div.childNodes[i];
    if (e instanceof Text) {
      if(e.textContent.trim().length == 0) {
        div.removeChild(e);
      }
    }
  }
  return div.childNodes;
}

function elementFromHTML(html) {
  var d = "div";
  if (html.substring(0, 3).toLowerCase().startsWith("<tr")){
    d = "tbody";
  }
  var contdiv = document.createElement(d);
  contdiv.innerHTML = html;

  var x = (div) => {
    for(var i = div.childNodes.length - 1; i >= 0; i--) {
      var e = div.childNodes[i];
      if (e instanceof Text) {
        var s = e.textContent.trim();
        if(s.length == 0) {
          div.removeChild(e);
          continue;
        }
        if(s.startsWith("@d5c:")) {
          var holder = d5ctext([s.substring(5)]);
          e.addD5cProp(holder);
        }
      } else if (e instanceof HTMLElement) {
        x(e);
        
        for(var prop of ["__d5c__innerHTML", "__d5c__label"]) {
          var s = e[prop];
          if (isDefined(s)) {
            var holder = d5ctext([s]);
            e.addD5cProp(prop.substring(7), holder);
            continue;
          }
          var s = e.getAttribute(prop);
          if (isDefined(s)) {
            var holder = d5ctext([s]);
            e.addD5cProp(prop.substring(7), holder);
            continue;
          }
        }
      }
    }
  };

  x(contdiv);
  if (contdiv.childNodes.length == 1) {
    return contdiv.childNodes[0];
  }
  return contdiv;
}

;(() => {

  class ValueChangedEvent extends CustomEvent {
    constructor(type, key, value) {
      super(type, {detail : undefined})
      this.key = key;
      this.value = value;
    }
  }

  var addLoggingSettersCheckSymbol = Symbol("addLoggingSettersCheck");

  function Object__getD5cProp (key) {
    var holder = new CcD5cHolder(_ => this[key], v => {this[key] = v});

    let helper = null;
    let helperlist = Object.getOwnPropertySymbols(this, addLoggingSettersCheckSymbol);
    if (helperlist.length == 0) {
      Object.defineProperty(this, addLoggingSettersCheckSymbol, {
        value: {
          has : new WeakMap(),
          handler : new WeakMap(),
          events : new EventTarget(),
        },
        writable: false,
        enumerable: false,
      });
      helperlist = Object.getOwnPropertySymbols(this, addLoggingSettersCheckSymbol);
      helper = this[helperlist[0]];
    } else {
      helper = this[helperlist[0]];
    }

    if (this.hasOwnProperty(key) && typeof this[key] === 'function') {
      return;
    }

    if (!helper.has[key]) {
      helper.has[key] = true;

      let desc = Object.getOwnPropertyDescriptor(this, key);
      if (!desc) {
        Object.defineProperty(this, key, {
          enumerable: true,
          configurable: true,
        });

        desc = Object.getOwnPropertyDescriptor(this, key);
      }

      Object.defineProperty(this, key, {
        get: function () {
          return desc.value;
        },
        set: function (newValue) {
          if (desc.value instanceof CcD5cHolder && helper.handler[key]) {
            console.warn("D5c dereg", key);
            desc.value.removeEventListener("d5c_changed", helper.handler[key])
            helper.handler[key] = null;
          }
          desc.value = newValue;
          if (desc.value instanceof CcD5cHolder) {
            console.warn("D5c reg", key);
            helper.handler[key] = () => {
              console.warn("D5c event", key);
              holder.sendEvent()
            };
            desc.value.addEventListener("d5c_changed", helper.handler[key])
          }
          holder.sendEvent();
        },
        enumerable: true,
        configurable: true,
      });
    }
    return holder;
  }

  Object.defineProperty(Object.prototype, "getD5cProp", {
      value: Object__getD5cProp,
      writable: true,
      enumerable: false,
    })
})();

String.prototype.escapeXml = function escapeXml () {
  var span = document.createElement("span");
  span.innerText = this;
  return span.innerHTML;
}

String.prototype.interpolate = function(params, defaultvalue, foundnames) {
  var sanitized = this
    .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function(_, match){ var t = match.trim(); foundnames[t] = true; if (!isDefined(params[t])) {params[t] = isDefined(defaultvalue) ? defaultvalue : ""}; return `\$\{map.${t}\}`; })
    .replace(/(\$\{(?!map\.)[^}]+\})/g, '');
  return new Function('map', `return \`${sanitized}\`;`)(params);
}

Number.prototype.pad = function(size) {
  var neg = this < 0;
  var s = "";
  if (neg) {
    size--;
    s = String(-this);
  } else {
    s = String(this);
  }
  while (s.length < (size || 2)) {s = "0" + s;}
  return (neg ? "-" : "") + s;
}

String.prototype.pad = function(size) {
  var s = this;
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

const htmlFunctionArray = {};
let htmlFunctionArrayCount = 0;

const $TARGET = (obj, prop) => { var f = () => {return {obj, prop}}; f.__isTarget = true; return f;};

const $OPTIONS = (obj) => { var f = () => {return obj}; f.__isOptions = true; return f;};

const html = function html(strings, ...values) {
  let str = '';
  strings.forEach((string, i) => {
    var s = (values.length > i) ? values[i] : "";
    if (!isDefined(s) || !s.escapeXml) {
      if (s instanceof Function) {
        let name = "@function:" + (htmlFunctionArrayCount++);
        htmlFunctionArray[name] = { func : s, timestamp : new Date().getTime(), cleanup : setTimeout(() => {delete htmlFunctionArray[name]}, 2000) };
        s = name;
      } else if (s instanceof CcD5cHolder) {
        let name = "@function:" + (htmlFunctionArrayCount++);
        htmlFunctionArray[name] = { func : s, timestamp : new Date().getTime(), cleanup : setTimeout(() => {delete htmlFunctionArray[name]}, 2000) };
        s = name;
      } else if (isDefined(s) && s.toString) {
        s = s.toString();
      } else {
        s = "" + s;
      }
    }
    str += string + s.escapeXml();
  });
  return str;
}

function getNavLang() {
  return ((navigator.language || navigator.userLanguage || "de").split(",")[0]).split("-")[0];
}

class CcTranslation extends EventTarget {
  #translations = {};
  #languages = {};
  #language = window.localStorage.getItem("CcTranslation__language") || getNavLang();
  #missingcallback = null;
  #missingnotified = {};
  constructor() {
    super();
    Object.defineProperty(this, "language", {
      get : () => {
        return this.#language;
      },
      set : (value) => {
        this.#language = value;
        window.localStorage.setItem("CcTranslation__language", this.#language)
        this.dispatchEvent(new CustomEvent("t9n_changed"))
      },
    })
  }

  getLanguages() {
    return Object.keys(this.#languages);
  }

  registermissing (missingcallback) {
    this.#missingcallback = missingcallback;
  }

  registerlanguage (language, flag, languagename, translation) {
    if (translation) {
      for (var key in translation) {
        if (!key) {
          continue;
        }
        var value = translation[key];
        if (!this.#translations[key]) {
          this.#translations[key] = {};
        }
        this.#translations[key][language] = value;
      }
    }
    this.#languages[language] = {flag, languagename};
  }

  addTranslations(translation) {
    for (var key in translation) {
      if (!key) {
        continue;
      }
      var value = translation[key];
      if (!this.#translations[key]) {
        this.#translations[key] = {};
      }
      for(var language in value) {
        this.#translations[key][language] = value[language];
      }
    }
  }

  getLangObjFromString(s, values) {
    var o = { values : [] };
    if (s.split) {
      o.strings = s.split(/(\${[0-9]*})/);
      for(var i = 0; i < o.strings.length; i++) {
        var m = o.strings[i].match(/\${([0-9]*)}/);
        if (m) {
          if (m[1]) {
            o.values.push (values[parseInt(m[1]) - 1]);
          } else {
            o.values.push (values[i - 1]);
          }
          o.strings.splice(i, 1);
          i--;
        }
      }
    } else {
      o.strings = [s]
    }
    return o;
  }

  xl8 (strings, values) {
    var string = strings.join("${}");

    if (!this.#translations[string]) {
      if (this.#missingcallback) {
        var debug = false;
        if (this.#missingcallback(string, this.#language, this.#missingnotified[string + "@"])) {
          debug = true;
        }
        this.#missingnotified[string + "@"] = true;
        if (debug) {
          return { values : [], strings : [`@@${string}@@`] };
        }
      }
      return null;
    }

    var lang = this.language;
    if (this.#translations[string][lang]) {
      if (this.#translations[string][lang].split) {
        return this.getLangObjFromString(this.#translations[string][lang], values)
      }

      var o = { values : [] };
      o.strings = [this.#translations[string][lang]]
      return o;
    }

    if (this.#missingcallback) {
      var debug = false;
      if (this.#missingcallback(string, this.language, this.#missingnotified[string + "@" + this.language])) {
        debug = true;
      }
      this.#missingnotified[string + "@" + this.language] = true;
      if (debug) {
        return { values : [], strings : [`@@${string}@@`] };
      }
    }
    return this.getLangObjFromString(string, values);
  }
}

var translation = new CcTranslation();

class CcD5cHolder extends EventTarget {
  constructor (getvalue, setvalue) {
    super()
    this.getvalue = getvalue;
    this.setvalue = setvalue;
  }

  toString() {
    var x = this.getvalue();
    while(x instanceof CcD5cHolder) {
      x = x.toString();
    }
    return x;
  }

  setValue(x) {
    if (this.setvalue) {
      this.setvalue(x);
    }
  }

  sendEvent() {
    this.dispatchEvent(new CustomEvent("d5c_changed"));
  }
}

Object.defineProperty(globalThis, "t9n_language", {
  get: function () {
    return translation.language;
  },
  set: function (newValue) {
    translation.language = newValue;
  },
  enumerable: true,
  configurable: true,
});


function t9n_registerlanguage (language, flag, languagename, p_translation) {
  return translation.registerlanguage(language, flag, languagename, p_translation);
}

function t9n_xl8 (strings, values) {
  return translation.xl8(strings, values);
}

function __t9n(strings, origvalues) {
  var hasTranslation = false;
  values = origvalues.map((x) => {
    if (x instanceof CcD5cHolder) {
      return x.toString();
    }
    return x;
  })

  var xl8 = t9n_xl8 (strings, values);
  if (xl8) {
    hasTranslation = true;
    strings = xl8.strings;
    values = xl8.values;
  }

  let str = '';
  strings.forEach((string, i) => {
    var s = (values.length > i) ? values[i] : "";
    if (!isDefined(s) || !s.escapeXml) {
      if (isDefined(s) && s.toString) {
        s = s.toString();
      } else {
        s = "" + s;
      }
    }
    str += string + s.escapeXml();
  });

  return str;
}

const t9n = function t9n(strings, ...values) {
  return __t9n(strings, values);
}

const d5ctext = function d5ctext(strings, ...values) {
  var hasTranslation = false;
  var xl8 = t9n_xl8 (strings, values);
  if (xl8) {
    hasTranslation = true;
  }

  var holder = new CcD5cHolder(_ => __t9n(strings, values));
  values.forEach((x) => {
    if (x instanceof CcD5cHolder) {
      x.addEventListener("d5c_changed", () => {
        holder.sendEvent()
      })
    }
  })
  if (hasTranslation) {
    translation.addEventListener("t9n_changed", () => {
      holder.sendEvent()
    })
  }
  return holder;
}

const d5cprop = function d5cprop(obj, key) {
  return obj.getD5cProp(key)
}

const t9nhtml = function t9nhtml(strings, ...origvalues) {
  var values = origvalues.map((x) => {
    if (x instanceof CcD5cHolder) {
      return x.toString();
    }
    return x;
  })
  var xl8 = t9n_xl8 (strings, values);
  if (xl8) {
    strings = xl8.strings;
    values = xl8.values;
  }

  let str = '';
  strings.forEach((string, i) => {
    var s = (values.length > i) ? values[i] : "";
    str += string + "" + s;
  });
  return str;
}


function htmlelement(strings, ...values) {
  values = values.map((x) => {
    if (x instanceof CcD5cHolder) {
      let name = "@function:" + (htmlFunctionArrayCount++);
      htmlFunctionArray[name] = { func : x, timestamp : new Date().getTime(), cleanup : setTimeout(() => {delete htmlFunctionArray[name]}, 2000) };
      return name;
    } else if (x instanceof Function) {
      let name = "@function:" + (htmlFunctionArrayCount++);
      htmlFunctionArray[name] = { func : x, timestamp : new Date().getTime(), cleanup : setTimeout(() => {delete htmlFunctionArray[name]}, 2000) };
      return name;
    }
    return x;
  })
  let str = '';
  strings.forEach((string, i) => {
    var s = (values.length > i) ? values[i] : "";
    str += string + "" + s;
  });
  return elementFromHTML(str);
}


function debounce(callback, timeout) {
    let timer;
    return function (...args) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(callback, timeout, ...args);
    };
}

function isEllipsisActive(e) {
     return (e.offsetWidth < e.scrollWidth);
}

function depthFirstTreeSort(arr, cmp, idkey, parentkey, rootkey, levelkey) {
    function makeTree(treesrc) {
        var tree = {};
        for (var i = 0; i < treesrc.length; i++) {
            if (!tree[treesrc[i][parentkey]]) {
              tree[treesrc[i][parentkey]] = [];
            }
            tree[treesrc[i][parentkey]].push(treesrc[i]);
        }
        return tree;
    }

    function depthFirstTraversal(tree, id, cmpfun, callback, level) {
        var children = tree[id];
        if (children) {
            children.sort(cmpfun);
            for (var i = 0; i < children.length; i++) {
              children[i][levelkey] = level;
              callback(children[i]);
              depthFirstTraversal(tree, children[i][idkey], cmpfun, callback, level + 1);
            }
        }
    }

    var i = 0;
    depthFirstTraversal(makeTree(arr), rootkey, cmp, function(node) {
        arr[i++] = node;
    }, 0);
}

function makeUnselectable(element) {
  if (typeof element.onselectstart !== 'undefined') {
    element.onselectstart = () => { return false; };
  }
  element.style['userSelect'] = 'none';
  if (typeof element.unselectable === 'string') {
    element.unselectable = 'on';
  }
  return element;
}

function searchhelper_matches(needle, haystack)
{
  haystack = haystack.toLocaleLowerCase();
  var needles = needle.toLocaleLowerCase().split(" ");
  var found = false;
  for(var needle of needles) {
    if (needle.startsWith("+")) {
      needle = needle.substring(1);
      if(haystack.indexOf(needle) < 0) {
        return false;
      } else {
        found = true;
      }
    } else if(!found && haystack.indexOf(needle) >= 0) {
      found = true;
    }
  }
  return found;
}

function searchhelper_filter(needle, callback)
{
  var needles = needle.toLocaleLowerCase().split(" ");
  return (haystack) => {
    var found = false;
    for(var needle of needles) {
      if (needle.startsWith("+")) {
        needle = needle.substring(1);
        if(haystack.indexOf(needle) < 0) {
          return false;
        } else {
          found = true;
        }
      } else if(!found && haystack.indexOf(needle) >= 0) {
        found = true;
      }
    }
    return found;
  }
}

/*
var a = [
  {name:"hello world"},
  {name:"helloworld"},
  {name:"hell world"},
  {name:"hello worl"},
  {name:"helo word"},
];
var filterfn = searchhelper_filter("+hello world");
console.log("1", a.filter((x) => { return filterfn(x.name); }));

console.log("------")

console.log("1", searchhelper_filter("hello world")("hello wor"))
console.log("2", searchhelper_filter("+hello world")("hello wor"))
console.log("3", searchhelper_filter("hello +world")("hello wor"))
console.log("4", searchhelper_filter("+hello +world")("hell world"))
console.log("5", searchhelper_filter("+hello +world")("hello world"))
console.log("6", searchhelper_filter("the hello +world")("the world"))
console.log("7", searchhelper_filter("the hello +world")("hello world"))
console.log("8", searchhelper_filter("the hello +world")("world"))
console.log("9", searchhelper_filter("the hello +world")("the hello"))

*/
