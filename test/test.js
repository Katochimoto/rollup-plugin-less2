import fs from 'fs';
import path from 'path';
import { rollup } from 'rollup';
import { assert } from 'chai';
import LessPluginCssModules from 'less-plugin-css-modules';
import RollupPluginLess2 from '../src/index.js';

describe('rollup-plugin-less2', function () {
  it('css модуль со вставкой стиля в head', function () {
    return rollup({
      entry: path.join(__dirname, 'samples', 'test1.js'),
      plugins: [
        RollupPluginLess2({
          cssModules: true,
          output: false, // path.join(__dirname, 'samples', 'style.css'),
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
      const result = bundle.generate({ sourceMap: false, format: 'cjs' });
      const compare = fs.readFileSync(path.join(__dirname, 'samples', 'test1.result.js'), 'utf8');
      assert(result.code === compare);
    });
  });

  it('вставка стиля в head без css модуля', function () {
    return rollup({
      entry: path.join(__dirname, 'samples', 'test2.js'),
      plugins: [
        RollupPluginLess2({
          cssModules: false,
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
      const result = bundle.generate({ sourceMap: false, format: 'cjs' });
      // fs.writeFileSync(path.join(__dirname, 'samples', 'test2.result.js'), result.code, 'utf8');
      const compare = fs.readFileSync(path.join(__dirname, 'samples', 'test2.result.js'), 'utf8');
      assert(result.code === compare);
    });
  });
});
