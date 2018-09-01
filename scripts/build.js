const shelljs = require('shelljs');
const webpack = require('webpack');
const webpackConfig = require('./webpack-config');
const { getEntry } = require('./get-entry');
const { outputPath } = require('./config');

async function run() {
  shelljs.rm('-rf', outputPath);
  webpackConfig.mode = 'production';
  webpackConfig.entry = await getEntry();
  const compiler = webpack(webpackConfig);
  compiler.run((err, stats) => {
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

run();
