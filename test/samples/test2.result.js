'use strict';


var __$injectStyle = (function () {
  var context = (function () { return this || (1, eval)('this'); })();
  var injectObject = {
  "2602354308": ".app__test {\n  color: #000;\n}\n:export {\n  app: app__test;\n}\n"
};
  function injectStyle(cssText, context) {
  if (!cssText || context.window !== context) {
    return;
  }

  var doc = context.document;
  var head = doc.head || doc.getElementsByTagName('head')[0];
  var style = doc.createElement('style');

  style.setAttribute('media', 'screen');
  style.setAttribute('type', 'text/css');

  if (style.styleSheet) {
    style.styleSheet.cssText = cssText;
  } else {
    style.appendChild(doc.createTextNode(cssText));
  }

  head.appendChild(style);
}
  return function (hash) {
    injectStyle(injectObject[hash], context);
  };
}());

var styles = __$injectStyle("2602354308");

if (styles.app) {
  console.log('!!!');
}
