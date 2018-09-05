const _ = require('lodash');
const { getOptions } = require('loader-utils');
const { extname, relative, dirname, basename } = require('path');
const { getEntryKeyByResourceFile } = require('./utils');

module.exports = function(source) {
  const { entryMap, entry } = getOptions(this);
  const resourcePath = this.resourcePath;
  const entryKey = getEntryKeyByResourceFile(resourcePath);

  // 不是entry不用包装
  if (!entryMap[entryKey]) {
    return source;
  }

  let importInject = '';
  // webpack 只导出最后一个entry
  // 这里最后一个entry 导入所有entry并导出...
  if (entryKey === entry[entry.length - 1]) {
    _.forEach(entryMap, (val, key) => {
      if (entryKey !== key) {
        const relativePath = relative(dirname(resourcePath), key);
        importInject += `exports.${val} = require('./${relativePath}').${val};\n`;
      }
    });
  }
  const fnName = entryMap[entryKey];
  return `
${importInject}
exports.${fnName} = function() {
  ${source}
};
  `
}
