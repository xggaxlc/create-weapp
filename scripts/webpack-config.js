const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { appRoot, outputPath } = require('./config');
const WeappWebpackPlugin = require('./plugin');

module.exports = {
  devtool: false,
  module: {
    rules: [
      {
        test: /\.bundle\.js$/,
        use: 'bundle-loader'
      },
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
    new WeappWebpackPlugin({
      outputPath
    }),
    new CopyWebpackPlugin([{
      from: appRoot,
      to: outputPath,
      cache: true,
    }], { ignore: ['*.js', '*.ts', '*.scss', '*.less', '*.css', '*.md'], debug: false })

  ]
}
