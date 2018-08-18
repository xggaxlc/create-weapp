const webpack = require('webpack');
const webpackConfig = require('./webpack-config');
const config = require('./config');
const chokidar = require('chokidar');

const path = require('path');
const srcPath = path.resolve('src');

webpackConfig.mode = 'development';

let webpackWatcher;
const watchCompiler = () => {
  const compiler = webpack(webpackConfig);
  webpackWatcher = compiler.watch({
    poll: true,
    ignored: /node_modules/
  }, (err, stats) => {
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      assets: false,
      errors: true,
      errorDetails: true,
      entrypoints: true
    }) + '\n\n');
  });
}

const runWebpackWatch = () => {
  webpackWatcher && webpackWatcher.close();
  watchCompiler();
}

chokidar
  .watch(`${config.srcPath}/**/*.ts`, { ignoreInitial: true })
  .on('add', runWebpackWatch)
  .on('unlink', runWebpackWatch);

runWebpackWatch();
