const fs = require('fs');
const path = require('path');
const glob = require('glob');
const _ = require('lodash');
const shell = require('shelljs');
const relative = path.relative;
const dirname = path.dirname;
const { ConcatSource } = require('webpack-sources');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const NAME = 'WeappWebpackPlugin';

module.exports = class WeappWebpackPlugin {

  constructor(config = {}) {
    const defaultSrcPath = path.resolve('src');
    const defaultConfig = {
      outputPath: path.resolve('dist'),
      srcPath: defaultSrcPath,
      miniprogramPath: defaultSrcPath,
    }
    this.config = Object.assign({}, defaultConfig, config);
    this.config.appPath = path.join(this.config.miniprogramPath, 'app.js');
    this.clearDist();
  }

  apply(compiler) {
    const { srcPath, outputPath, appPath, miniprogramPath } = this.config;
    compiler.options.entry = this.getEntry();
    compiler.options.output.path = outputPath;
    compiler.options.output.filename = '[name]';
    compiler.options.output.globalObject = 'global';
    compiler.options.output.libraryTarget = 'umd';
    compiler.options.optimization = _.merge({}, compiler.options.optimization, {
      splitChunks: {
        chunks(chunk) {
          return chunk.name.startsWith(relative(srcPath, miniprogramPath));
        },
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

    compiler.hooks.afterEnvironment.tap(NAME, () => {
      new CopyWebpackPlugin([{
        from: srcPath,
        to: outputPath,
        cache: true,
      }], { ignore: ['*.js', '*.ts', '*.scss', '*.less', '*.css', '*.md'], debug: false }).apply(compiler);
    });

    compiler.hooks.emit.tapAsync(NAME, (compilation, callback) => {
      const chunks = compilation.chunks;
      const assets = compilation.assets;
      const nonEntryChunks = chunks.filter(chunk => !chunk.hasRuntime());

      const appAssetName = this.getEntryName(appPath);
      const appAssetConcatSource = new ConcatSource(assets[appAssetName].source());
      _.flattenDeep(nonEntryChunks.map(chunk => chunk.files))
        .forEach(assetName => {
          appAssetConcatSource.add(assets[assetName].source());
          delete assets[assetName];
        });
      assets[appAssetName] = appAssetConcatSource;
      callback();
    });
  }

  clearDist() {
    const { outputPath } = this.config;
    shell.rm('-rf', outputPath);
    shell.mkdir(outputPath);
  }

  getEntryName(filename) {
    const { srcPath } = this.config;
    const ext = path.extname(filename);
    return relative(srcPath, filename).replace(ext, '.js');
  }

  getEntry() {
    const { srcPath } = this.config;
    const entry = {};
    glob.sync(`${srcPath}/**/*.ts`)
    .forEach(filename => {
      if (!/\.d\.ts$/.test(filename)) {
        entry[this.getEntryName(filename)] = filename;
      }
    });
    return entry;
  }
}
