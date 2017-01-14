const path = require('path');
const rollup = require('rollup');
const LessPluginCssModules = require('less-plugin-css-modules');
const RollupPluginLess2 = require('../src/index.js');

describe('rollup-plugin-less2', function () {
  it('converts less', function () {
    return rollup.rollup({
      entry: path.join(__dirname, 'samples', 'main.js'),
      plugins: [
        RollupPluginLess2.default({
          cssModules: true,
          output: path.join(__dirname, 'samples', 'style.css'),
          options: {
            plugins: [
              new LessPluginCssModules.default({
                mode: 'local',
                hashPrefix: 'test',
                generateScopedName: '[local]___[hash:base64:5]'
              })
            ]
          }
        })
      ]
    }).then(bundle => {
      const result = bundle.generate({ sourceMap: false, format: 'cjs' });

      console.log('>>>>', result.code);
    });
  });
});
