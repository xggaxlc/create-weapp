const webpack = require('webpack');
const webpackConfig = require('./webpack-config');

webpackConfig.mode = 'production';
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
