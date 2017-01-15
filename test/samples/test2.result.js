'use strict';

function __$injectStyle(css, out) {
  if (!css) {
    return;
  }

  var context = function () {
    return this || (1, eval)('this');
  }();

  if (context.window !== context) {
    return;
  }

  var style = context.document.createElement('style');
  style.setAttribute('media', 'screen');
  style.innerHTML = css;

  context.document.getElementsByTagName('head')[0].appendChild(style);
  return out || css;
}

var styles = __$injectStyle(".app__test {\n  color: #000;\n}\n:export {\n  app: app__test;\n}\n");

if (styles.app) {
  console.log('!!!');
}
