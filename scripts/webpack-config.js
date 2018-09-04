const path = require('path');
const uuid = require('uuid');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const { appRoot, outputPath, bundleName } = require('./config');
const WeappWebpackPlugin = require('./plugin');

const { NODE_ENV, PORT, IP = require('ip').address() } = process.env;

function getWebpackConfig(entry = []) {
  const entryMap = {};
  entry.forEach(item => entryMap[item] = 'func_' + uuid.v4().replace(/-/g, ''));

  const config = {
    devtool: false,
    entry,
    output: {
      path: outputPath,
      filename: bundleName,
      libraryTarget: 'commonjs2'
    },
    optimization: {
      splitChunks: false
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: path.resolve('scripts/entry-loader.js'),
              options: {
                entryMap,
                entry
              }
            },
            'ts-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name(file) {
                  const ext = path.extname(file);
                  const filename = file.replace(appRoot, '').replace(ext, '');
                  return `${filename}.wxss`;
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
      extensions: ['.js', '.ts', '.json', '.scss']
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(NODE_ENV),
          ip: JSON.stringify(IP),
          port: JSON.stringify(PORT),
        }
      }),
      new WeappWebpackPlugin({
        outputPath,
        entryMap,
        bundleName
      }),
      new CopyWebpackPlugin([{
        from: appRoot,
        to: outputPath,
        cache: true,
      }], { ignore: ['*.js', '*.ts', '*.scss', '*.less', '*.css', '*.md'], debug: false })

    ]
  }

  return config;
}

module.exports = {
  getWebpackConfig
}
