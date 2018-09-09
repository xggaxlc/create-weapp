const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const { appRoot, outputPath, bundleName } = require('./config');
const WeappWebpackPlugin = require('./plugin');
const { getEntryMap } = require('./utils');

const { NODE_ENV, PORT, IP = require('ip').address() } = process.env;

function getWebpackConfig(entry = []) {

  const entryMap = getEntryMap(entry);

  const entryLoader = {
    loader: path.resolve('scripts/entry-loader.js'),
    options: {
      entryMap,
      entry
    }
  }

  const entryFileLoader = {
    loader: path.resolve('scripts/entry-file-loader.js'),
    options: {
      entryMap,
      entry,
      exts: ['wxml', 'scss', 'wxss', 'json']
    }
  }

  const getOutputPath = (file, replaceExt) => {
    const filename = file.replace(appRoot, '');
    return replaceExt ? filename.replace(path.extname(file), replaceExt) : filename;
  }

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
            { ...entryLoader },
            'ts-loader',
            { ...entryFileLoader }
          ]
        },
        {
          test: /\.js$/,
          use: [
            { ...entryLoader },
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            },
            { ...entryFileLoader }
          ]
        },
        {
          test: /\.(scss)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name(file) {
                  return getOutputPath(file, '.wxss');
                }
              }
            },
            'extract-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        {
          type: 'javascript/auto',
          test: /\.json/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name(file) {
                  return getOutputPath(file);
                }
              }
            }
          ]
        },
        {
          test: /\.(wxml|wxss)/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name(file) {
                  return getOutputPath(file);
                }
              }
            }
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
        from: `${appRoot}/**/*.+(png|jpg|jpeg|gif|wxs)`,
        to: outputPath,
        cache: true,
        context: appRoot
      }], { debug: false })
    ]
  }

  return config;
}

module.exports = getWebpackConfig;
