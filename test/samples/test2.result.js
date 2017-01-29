'use strict';


var __$injectStyle = (function () {
  var context = (function () { return this || (1, eval)('this'); })();
  var exportObject = {
  "2602354308": {
    "app": "app__test"
  }
};
  var injectObject = {
  "2602354308": ".app__test {\n  color: #000;\n}\n\n"
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
    return exportObject[hash];
  };
}());

Object.defineProperty(exports, '__esModule', { value: true });

__$injectStyle("2602354308");
