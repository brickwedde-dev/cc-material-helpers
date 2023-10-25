function isDefined(v) {
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
}

HTMLElement.prototype.addT9nProp = function HTMLElement__addT9nProp(property, value) {
  if (!this.__cc_translation) {
    this.__cc_translation = [];
    document.body.addEventListener("t9n_changed", () => {
      this.__applyT9n();
    });
  }
  this.__cc_translation.push({property, value});
  this[property] = value.xlate();
  return this
}

HTMLElement.prototype.addT9nAttr = function HTMLElement__addT9nAttr(attribute, value) {
  if (!this.__cc_translation) {
    this.__cc_translation = [];
    document.body.addEventListener("t9n_changed", () => {
      this.__applyT9n();
    });
  }
  this.__cc_translation.push({attribute, value});
  this.setAttribute(attribute, value.xlate());
  return this
}

HTMLElement.prototype.__applyT9n = function HTMLElement____applyT9n() {
  if (this.__cc_translation) {
    this.__cc_translation.map((t) => {
      if (t.property) {
        this[t.property] = t.value.xlate();
      }
      if (t.attribute) {
        this.setAttribute(t.attribute, t.value.xlate());
      }
    })
  }
}

HTMLElement.prototype.setChildren = function HTMLElement__setChildren(...childNodes) {
  var r = [];
  this.innerHTML = "";
  this.appendChildren(...childNodes)
  return this;
}

HTMLElement.prototype.appendChildren = function HTMLElement__appendChildren(...childNodes) {
  var r = [];
  this.innerHTML = "";
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
  if (div.childNodes.length == 1) {
    return div.childNodes[0];
  }
  return div;
}

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

class CcT9nHolder {
  constructor (f) {
    this.f = f;
  }

  xlate() {
    return this.f();
  }
}

const t9n_translations = {};
const t9n_languages = {};
var t9n_language = "de";

function t9n_registerlanguage (language, flag, languagename, translation) {
  t9n_translations[language] = translation;
  t9n_languages[language] = {flag, languagename};
}

function t9n_xl8 (strings, values) {
  var string = strings.join("${}");

  if (!t9n_translations[t9n_language]) {
    return null;
  }

  if (t9n_translations[t9n_language][string]) {
    var o = { values : [] };
    if (t9n_translations[t9n_language][string].split) {
      o.strings = t9n_translations[t9n_language][string].split(/(\${[0-9]*})/).filter((x) => {
        var m = x.match(/\${[0-9]*}/);
        if (m) {
          o.values.push (values[parseInt(m[0].substring(2)) - 1]);
          return false;
        }
        return true;
      });
    } else {
      o.strings = [t9n_translations[t9n_language][string]]
    }
    return o;
  }
  return null;
}

function __t9n(strings, values) {
  values = values.map((x) => {
    if (x instanceof CcT9nHolder) {
      return x.xlate();
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

const t9ntext = function t9ntext(strings, ...values) {
  return new CcT9nHolder(_ => __t9n(strings, values));
}

const t9nhtml = function t9n(strings, ...values) {
  values = values.map((x) => {
    if (x instanceof CcT9nHolder) {
      return x.xlate();
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
    if (x instanceof CcT9nHolder) {
      return x.xlate();
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
