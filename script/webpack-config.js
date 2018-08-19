const webpack = require('webpack');
const path = require('path');
const WeappWebpackPlugin = require('./weapp-webpack-plugin');
const config = require('./config');
const srcPath = config.srcPath;

module.exports = {
  devtool: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader']
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name(file) {
                const ext = path.extname(file);
                const filename = file.replace(srcPath, '').replace(ext, '');
                return `${file.replace(srcPath, '').replace(ext, '')}.wxss`;
              }
            }
          },
          'extract-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.scss']
  },
  plugins: [
    new WeappWebpackPlugin({
      srcPath: config.srcPath,
      outputPath: config.outputPath
    }),
    new webpack.DefinePlugin({
      IS_PRODUCTION: config.IS_PRODUCTION
    })
  ]
}
