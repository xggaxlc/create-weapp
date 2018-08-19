const path = require('path');
const _  = require('lodash');
const ENV = _.get(process.env, 'NODE_ENV', 'development');

module.exports = {
  srcPath: path.resolve('src'),
  outputPath: path.resolve('dist'),
  ENV: _.get(process.env, 'NODE_ENV', 'development'),
  IS_PRODUCTION: ENV === 'production'
}
