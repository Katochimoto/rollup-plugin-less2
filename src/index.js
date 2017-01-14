import fs from 'fs-extra';
import postcss from 'postcss';
import less from 'less';
import { createFilter } from 'rollup-pluginutils';

const INSERT_STYLE = '__$insertStyle';

export default function RollupPluginLess2 ({
  include = [ '**/*.less', '**/*.css' ],
  exclude = 'node_modules/**',
  output = false,
  cssModules = false,
  options = {}
} = {}) {

  let firstTransform = true;
  let exportCss = {};

  const filter = createFilter(include, exclude);

  return {
    name: 'less2',

    intro () {
      return !output ? insertStyle.toString().replace(/insertStyle/, INSERT_STYLE) : '';
    },

    transform (code, id) {
      if (!filter(id)) {
        return;
      }

      let resultCss;
      less.render(code, options, function (error, { css }) {
        if (!error) {
          resultCss = css;
        }
      });

      if (!resultCss) {
        return;
      }

      if (cssModules && resultCss.indexOf(':export') !== -1) {
        resultCss = resultCss.replace(/^\s*:export\s*{[^}]+}/m, function (exportValue) {
          postcss.parse(exportValue).first.each(function (decl) {
            exportCss[ decl.prop ] = decl.value;
          });

          return '';
        });
      }

      let exportCode = 'export default undefined;';

      if (cssModules) {
        if (!output) {
          exportCode = `export default ${INSERT_STYLE}(${JSON.stringify(resultCss)}, ${JSON.stringify(exportCss)});`;
        } else {
          exportCode = `export default ${JSON.stringify(exportCss)};`;
        }
      } else {
        if (!output) {
          exportCode = `export default ${INSERT_STYLE}(${JSON.stringify(resultCss)});`;
        }
      }

      if (output && typeof output === 'string') {
        if (firstTransform) {
          fs.writeFileSync(output, resultCss);
        } else {
          fs.appendFileSync(output, resultCss);
        }
      }

      firstTransform = false;
      return {
        code: exportCode,
        map: { mappings: '' }
      };
    }
  };
};

function insertStyle (css, out) {
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
