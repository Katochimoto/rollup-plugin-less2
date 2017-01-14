# rollup-plugin-less2
A rollup plugin for less files, support css modules

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
