const path = require('path');
const rollup = require('rollup');
const RollupPluginLess2 = require('../src/index.js');

describe('rollup-plugin-less2', function () {
  it('converts less', function () {
    return rollup.rollup({
      entry: path.join(__dirname, 'samples', 'main.js'),
      plugins: [
        RollupPluginLess2.default({
          cssModules: false,
          output: false // path.join(__dirname, 'samples', 'style.css')
        })
      ]
    }).then(bundle => {
      const result = bundle.generate({ sourceMap: false, format: 'cjs' });

      // console.log('>>>>', result.code);
    });
  });
});
