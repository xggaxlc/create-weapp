const path = require('path');
const _ = require('lodash');
const { ConcatSource } = require('webpack-sources');
const { getEntryName } = require('./get-entry');

const NAME = 'WeappWebpackPlugin';
const { resolve, join } = path;

module.exports = class WeappWebpackPlugin {

  constructor(config = {}) {
    const defaultConfig = {
      appRoot: resolve('src'),
      outputPath: resolve('build')
    };
    this.config = Object.assign({}, defaultConfig, config);
  }

  apply(compiler) {
    const { outputPath, appRoot } = this.config;
    compiler.options.output.path = outputPath;
    compiler.options.output.filename = '[name]';
    compiler.options.output.libraryTarget = 'commonjs2';
    compiler.options.output.globalObject = 'global';
    compiler.options.optimization = _.merge({}, compiler.options.optimization, {
      splitChunks: {
        chunks: 'all',
        minSize: 0,
        minChunks: 1,
        name: true,
        cacheGroups: {
          vendors: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 2
          },
          default: {
            name: 'common',
            minChunks: 2,
            priority: 1,
            reuseExistingChunk: true
          }
        }
      }
    });

    compiler.hooks.emit.tapAsync(NAME, (compilation, callback) => {
      const chunks = compilation.chunks;
      const assets = compilation.assets;
      const nonEntryChunks = chunks.filter(chunk => !chunk.hasRuntime());

      const appAssetName = getEntryName(join(appRoot, 'app'));
      const injectSource = new ConcatSource('');
      _.flattenDeep(nonEntryChunks.map(chunk => chunk.files))
        .forEach(assetName => injectSource.add(`require('${assetName}');\n`));
      injectSource.add(assets[appAssetName].source());
      assets[appAssetName] = injectSource;
      callback();
    });
  }
}
