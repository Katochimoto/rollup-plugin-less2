# rollup-plugin-less2
A rollup plugin for less files, support css modules.

[![Build Status][build]][build-link] [![NPM version][version]][version-link] [![Dependency Status][dependency]][dependency-link] [![devDependency Status][dev-dependency]][dev-dependency-link]

```js
// rollup.config.js
import RollupPluginLess2 from 'rollup-plugin-less2';
import LessPluginCssModules from 'less-plugin-css-modules';

// ...

export default {
  // ...
  plugins: [
    RollupPluginLess2({
      output: false,
      cssModules: true,
      options: {
        plugins: [
          new LessPluginCssModules({
            mode: 'local',
            hashPrefix: 'test',
            generateScopedName: '[local]___[hash:base64:5]'
          })
        ]
      }
    })
  ]
};
```

## Options

- *{string}* rootpath=process.cwd()
- *{string|string[]}* include=['\*\*/\*.less', '\*\*/\*.css']
- *{string|string[]}* exclude='node_modules/\*\*'
- *{boolean|string|function}* output=false
- *{string}* sourceMapOutput
- *{boolean}* cssModules=false
- *{object}* options={}
- *{function}* onWriteBefore


[build]: https://travis-ci.org/Katochimoto/rollup-plugin-less2.svg?branch=master
[build-link]: https://travis-ci.org/Katochimoto/rollup-plugin-less2
[version]: https://badge.fury.io/js/rollup-plugin-less2.svg
[version-link]: http://badge.fury.io/js/rollup-plugin-less2
[dependency]: https://david-dm.org/Katochimoto/rollup-plugin-less2.svg
[dependency-link]: https://david-dm.org/Katochimoto/rollup-plugin-less2
[dev-dependency]: https://david-dm.org/Katochimoto/rollup-plugin-less2/dev-status.svg
[dev-dependency-link]: https://david-dm.org/Katochimoto/rollup-plugin-less2#info=devDependencies
