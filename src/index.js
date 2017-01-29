import fs from 'fs-extra';
import mkdirp from 'mkdirp';
import { dirname } from 'path';
import stringHash from 'string-hash';
import postcss from 'postcss';
import less from 'less';
import { createFilter } from 'rollup-pluginutils';

const INJECT_STYLE = '__$injectStyle';

/**
 * @param {string|string[]} [include=['**\/*.less', '**\/*.css']]
 * @param {string|string[]} [exclude='node_modules/**']
 * @param {boolean|string|function} [output=false]
 * @param {boolean} [cssModules=false]
 * @param {Object} [options={}]
 * @returns {{ name: string, intro: function, transform: function, onwrite: function }}
 */
export default function RollupPluginLess2 ({
  include = [ '**/*.less', '**/*.css' ],
  exclude = 'node_modules/**',
  output = false,
  cssModules = false,
  options = {}
} = {}) {

  const cache = new Map();
  const filter = createFilter(include, exclude);

  return {
    name: 'less2',

    /**
     * @returns {string}
     */
    intro () {
      if (output) {
        const exportObject = {};
        cache.forEach(function (value, key) {
          exportObject[ key ] = value.modules;
        });

        if (cssModules) {
          return `
var ${INJECT_STYLE} = (function () {
  var exportObject = ${JSON.stringify(exportObject, null, 2)};
  return function (hash) {
    return exportObject[hash];
  };
}());`;
        }

      } else {
        const injectObject = {};
        const exportObject = {};
        cache.forEach(function (value, key) {
          exportObject[ key ] = value.modules;
          injectObject[ key ] = value.code;
        });

        if (cssModules) {
          return `
var ${INJECT_STYLE} = (function () {
  var context = (function () { return this || (1, eval)('this'); })();
  var exportObject = ${JSON.stringify(exportObject, null, 2)};
  var injectObject = ${JSON.stringify(injectObject, null, 2)};
  ${injectStyle.toString()}
  return function (hash) {
    injectStyle(injectObject[hash], context);
    return exportObject[hash];
  };
}());`;

        } else {
          return `
var ${INJECT_STYLE} = (function () {
  var context = (function () { return this || (1, eval)('this'); })();
  var injectObject = ${JSON.stringify(injectObject, null, 2)};
  ${injectStyle.toString()}
  return function (hash) {
    injectStyle(injectObject[hash], context);
  };
}());`;
        }
      }

      return '';
    },

    async onwrite () {
      if (output) {
        if (typeof output === 'string') {
          let css = '';
          cache.forEach(function (value) {
            css += value.code;
          });

          mkdirp.sync(dirname(output));
          await fs.writeFile(output, css);

        } else if (typeof output === 'function') {
          await output(cache);
        }
      }
    },

    /**
     * @param {string} code
     * @param {string} fileName
     * @returns {{ code: string, map: Object }}
     */
    async transform (code, fileName) {
      if (!filter(fileName)) {
        return;
      }

      const data = await parseCss(code, Object.assign({ filename: fileName }, options), cssModules);

      if (!data) {
        return;
      }

      const fileNameHash = String(stringHash(fileName));

      cache.set(fileNameHash, data);

      const exportCode = cssModules || !output ?
        `export default ${INJECT_STYLE}(${JSON.stringify(fileNameHash)});` :
        'export default undefined;';

      return {
        code: exportCode,
        map: { mappings: '' }
      };
    }
  };
};

/**
 * @param {string} cssText
 * @param {Object} context
 */
function injectStyle (cssText, context) {
  if (!cssText || context.window !== context) {
    return;
  }

  const doc = context.document;
  const head = doc.head || doc.getElementsByTagName('head')[0];
  const style = doc.createElement('style');

  style.setAttribute('media', 'screen');
  style.setAttribute('type', 'text/css');

  if (style.styleSheet) {
    style.styleSheet.cssText = cssText;

  } else {
    style.appendChild(doc.createTextNode(cssText));
  }

  head.appendChild(style);
}

/**
 * @param {string} code
 * @param {Object} options
 * @param {boolean} cssModules
 * @returns {Promise}
 */
function parseCss (code, options, cssModules) {
  return less.render(code, options).then(function (output) {
    const modules = {};

    if (cssModules && output.css && output.css.indexOf(':export') !== -1) {
      output.css = output.css.replace(/^\s*:export\s*{[^}]+}/m, function (exportValue) {
        postcss.parse(exportValue).first.each(function (decl) {
          modules[ decl.prop ] = decl.value;
        });

        return '';
      });
    }

    return {
      code: output.css,
      modules: modules
    };
  });
}
