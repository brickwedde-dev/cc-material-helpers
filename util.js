String.prototype.escapeXml = function escapeXml () {
  var span = document.createElement("span");
  span.innerText = this;
  return span.innerHTML;
}

const htmlFunctionArray = {};
var htmlFunctionArrayCount = 0;

const html = function html(strings, ...values) {
  let str = '';
  strings.forEach((string, i) => {
    var s = (values.length > i) ? values[i] : "";
    if (!isDefined(s) || !s.escapeXml) {
      if (s instanceof Function) {
        var name = "@function:" + (htmlFunctionArrayCount++);
        htmlFunctionArray[name] = { func : s, timestamp : new Date().getTime() };
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

