const shelljs = require('shelljs');
const webpack = require('webpack');
const getWebpackConfig = require('./webpack-config');
const getEntry = require('./get-entry');
const { outputPath, appRoot } = require('./config');

async function run() {
  shelljs.rm('-rf', outputPath);
  const entry = await getEntry(appRoot);
  const webpackConfig = getWebpackConfig(entry);
  webpackConfig.mode = 'production';
  const compiler = webpack(webpackConfig);
  compiler.run((err, stats) => {
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

run();
