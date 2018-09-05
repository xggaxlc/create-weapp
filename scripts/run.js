const webpack = require('webpack');
const webpackConfig = require('./webpack-config');
const getWebpackConfig = require('./webpack-config');
const getEntry = require('./get-entry');
const { appRoot } = require('./config');

async function watchCompiler() {
  const entry = await getEntry(appRoot);
  const webpackConfig = getWebpackConfig(entry);
  webpackConfig.mode = 'development';
  const compiler = webpack(webpackConfig);
  compiler.watch({
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

watchCompiler();
