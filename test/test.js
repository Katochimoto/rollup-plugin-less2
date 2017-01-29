import fs from 'fs';
import path from 'path';
import { rollup } from 'rollup';
import { assert } from 'chai';
import LessPluginCssModules from 'less-plugin-css-modules';
import RollupPluginLess2 from '../src/index.js';

describe('rollup-plugin-less2', function () {
  it('css модуль', function () {
    return rollup({
      entry: path.join(__dirname, 'samples', 'test1.js'),
      plugins: [
        RollupPluginLess2({
          cssModules: true,
          output: false,
          options: {
            plugins: [
              new LessPluginCssModules({
                mode: 'local',
                hashPrefix: 'test',
                generateScopedName: '[local]__test'
              })
            ]
          }
        })
      ]
    }).then(bundle => {
      const fileName = path.join(__dirname, 'samples', 'test1.result.js');
      const result = bundle.generate({ sourceMap: false, format: 'cjs' });

      fs.writeFileSync(fileName, result.code, 'utf8');

      const modules = require(fileName);

      assert(modules['app'] === 'app__test');
    });
  });
});
