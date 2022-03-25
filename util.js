function isDefined(v) {
  var t = typeof v;
  return t != "null" && t != "undefined" && t != "void";
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
    o.strings = t9n_translations[t9n_language][string].split(/(\${[0-9]*})/).filter((x) => {
      var m = x.match(/\${[0-9]*}/);
      if (m) {
        o.values.push (values[parseInt(m[0].substring(2)) - 1]);
        return false;
      }
      return true;
    });
    return o;
  }
  return null;
}

const t9n = function t9n(strings, ...values) {
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
