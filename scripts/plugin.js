const { resolve, join, dirname, relative } = require('path');
const _ = require('lodash');
const { ConcatSource } = require('webpack-sources');
const NAME = 'WeappWebpackPlugin';

module.exports = class WeappWebpackPlugin {

  constructor(config = {}) {
    const defaultConfig = {
      appRoot: resolve('src'),
      entryMap: {},
      bundleName: 'bundle.js'
    };
    this.config = Object.assign({}, defaultConfig, config);
  }

  apply(compiler) {
    const { entryMap, appRoot, bundleName } = this.config;

    compiler.hooks.emit.tapAsync(NAME, (compilation, callback) => {
      const assets = compilation.assets;
      const chunks = compilation.chunks;

      const bundleName = 'bundle.js';
      const bundleAssets = new ConcatSource();
      _.forEach(entryMap, (val, key) => {
        const assetsName = key.replace(appRoot, '').trim() + '.js';
        const relativePath = relative(dirname(assetsName), `/${bundleName}`);
        assets[assetsName] = new ConcatSource(`require('./${relativePath}').${val}();`);
      });
      callback();
    });
  }
}
