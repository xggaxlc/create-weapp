const webpack = require('webpack');
const webpackConfig = require('./webpack-config');
const { getEntry } = require('./get-entry');

let webpackWatcher;
async function watchCompiler() {
  webpackConfig.mode = 'development';
  webpackConfig.entry = await getEntry();
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

runWebpackWatch();
