const webpack = require('webpack');
const chokidar = require('chokidar');
const notifier = require('node-notifier');
const shelljs = require('shelljs');
const webpackConfig = require('./webpack-config');
const getWebpackConfig = require('./webpack-config');
const getEntry = require('./get-entry');
const { appRoot, outputPath } = require('./config');

let webpackWatcher;
let entryRecord = [];
async function watchCompiler(entry) {
  const webpackConfig = getWebpackConfig(entry);
  webpackConfig.mode = 'development';
  const compiler = webpack(webpackConfig);
  webpackWatcher = compiler.watch({
    poll: true,
    ignored: /node_modules/
  }, (err, stats) => {
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: true,
      chunkModules: false,
      assets: false,
      errors: true,
      errorDetails: true,
      entrypoints: true
    }) + '\n\n');
  });
}

async function run() {
  const entry = await getEntry(appRoot);
  if (entry.toString() !== entryRecord.toString()) {
    notifier.notify('webpack building');
    shelljs.rm('-rf', outputPath);
    webpackWatcher && webpackWatcher.close();
    entryRecord = entry.slice();
    watchCompiler(entry);
  }
}

chokidar
  .watch(`${appRoot}/**/*.json`, { ignoreInitial: true })
  .on('change', run);

run();
