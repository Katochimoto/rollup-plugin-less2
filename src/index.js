import fs from 'fs-extra';
import mkdirp from 'mkdirp';
import { dirname } from 'path';
import postcss from 'postcss';
import less from 'less';
import { createFilter } from 'rollup-pluginutils';

const INJECT_STYLE = '__$injectStyle';

/**
 * @param {string|string[]} [include=['**\/*.less', '**\/*.css']]
 * @param {string|string[]} [exclude='node_modules/**']
 * @param {boolean|string|function} [output=false]
 * @param {boolean} [cssModules=false]
 * @param {object} [options={}]
 * @returns {{ name: string, intro: function, transform: function }}
 */
export default function RollupPluginLess2 ({
  include = [ '**/*.less', '**/*.css' ],
  exclude = 'node_modules/**',
  output = false,
  cssModules = false,
  options = {}
} = {}) {

  let fileIndex = -1;

  const filter = createFilter(include, exclude);

  return {
    name: 'less2',

    /**
     * @returns {string}
     */
    intro () {
      return !output ? injectStyle.toString().replace(/injectStyle/, INJECT_STYLE) : '';
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

      options.filename = fileName;
      let resultCss = await less.render(code, options).then(function (result) {
        return result.css;
      });

      if (!resultCss) {
        return;
      }

      fileIndex++;

      const exportCss = {};
      const exportModules = cssModules && resultCss.indexOf(':export') !== -1;

      if (exportModules) {
        resultCss = resultCss.replace(/^\s*:export\s*{[^}]+}/m, function (exportValue) {
          postcss.parse(exportValue).first.each(function (decl) {
            exportCss[ decl.prop ] = decl.value;
          });

          return '';
        });
      }

      let exportCode = 'export default undefined;';

      if (exportModules) {
        if (!output) {
          exportCode = `export default ${INJECT_STYLE}(${JSON.stringify(resultCss)}, ${JSON.stringify(exportCss)});`;
        } else {
          exportCode = `export default ${JSON.stringify(exportCss)};`;
        }
      } else {
        if (!output) {
          exportCode = `export default ${INJECT_STYLE}(${JSON.stringify(resultCss)});`;
        }
      }

      if (output) {
        if (typeof output === 'string') {
          await fileOutput(resultCss, output, fileIndex);

        } else if (typeof output === 'function') {
          await output(resultCss, fileName, fileIndex);
        }
      }

      return {
        code: exportCode,
        map: { mappings: '' }
      };
    }
  };
};

/**
 * @param {string} css
 * @param {Object} [out]
 * @returns {string}
 */
function injectStyle (css, out) {
  if (!css) {
    return;
  }

  const context = (function () {
    return this || (1, eval)('this');
  })();

  if (context.window !== context) {
    return;
  }

  const style = context.document.createElement('style');
  style.setAttribute('media', 'screen');
  style.innerHTML = css;

  context.document.getElementsByTagName('head')[0].appendChild(style);
  return out || css;
}

/**
 * @param {string} css
 * @param {string} fileName
 * @param {number} fileIndex
 * @returns {Promise}
 */
function fileOutput (css, fileName, fileIndex) {
  if (fileIndex === 0) {
    mkdirp.sync(dirname(fileName));
    return fs.writeFile(fileName, css);

  } else {
    return fs.appendFile(fileName, css);
  }
}
