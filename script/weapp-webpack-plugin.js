const fs = require('fs');
const path = require('path');
const glob = require('glob');
const _ = require('lodash');
const shell = require('shelljs');
const { ConcatSource } = require('webpack-sources');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const NAME = 'WeappWebpackPlugin';

module.exports = class WeappWebpackPlugin {

  constructor(config = {}) {
    const defaultConfig = {
      distPath: path.resolve('dist'),
      srcPath: path.resolve('src')
    }
    this.config = Object.assign({}, defaultConfig, config);
    this.clearDist();
  }

  apply(compiler) {
    const { srcPath, distPath } = this.config;

    compiler.options.entry = this.getEntry();
    compiler.options.output.path = distPath;
    compiler.options.output.filename = '[name].js';
    compiler.options.output.globalObject = 'global';
    compiler.options.output.libraryTarget = 'umd';
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

    compiler.hooks.afterEnvironment.tap(NAME, () => {
      new CopyWebpackPlugin([{
        from: srcPath,
        to: distPath,
        cache: true,
      }], { ignore: ['*.js', '*.ts', '*.scss', '*.less', '*.css', '*.md'], debug: false }).apply(compiler);
    });

    compiler.hooks.emit.tapAsync(NAME, (compilation, callback) => {
      const chunks = compilation.chunks;
      const assets = compilation.assets;

      const chunkHasEntry = chunk => chunk.hasRuntime();
      const nonEntryChunks = chunks.filter(chunk => !chunkHasEntry(chunk));

      chunks.forEach(chunk => {
        if (chunkHasEntry(chunk)) {
          chunk.files.forEach(filename => {
            const source = assets[filename].source();
            let injectContent = '';
            nonEntryChunks.forEach(nonEntryChunk => {
              nonEntryChunk.files.forEach(file => {
                const commonPath = path.relative(distPath + path.dirname(filename), `${distPath}/${file}`);
                injectContent += `;require('./${commonPath}');\n`;
              });
            });
            assets[filename] = new ConcatSource(injectContent + source);
          });
        }
      });
      callback();
    });
  }

  clearDist() {
    const { distPath } = this.config;
    shell.rm('-rf', distPath);
    shell.mkdir(distPath);
  }

  getEntry() {
    const { srcPath } = this.config;
    const entry = {};
    glob.sync(`${srcPath}/**/*.ts`)
    .forEach(file => {
      if (!/\.d\.ts$/.test(file)) {
        const ext = path.extname(file);
        const entryKey = file.replace(srcPath, '').replace(ext, '');
        entry[entryKey] = file;
      }
    });
    return entry;
  }
}
