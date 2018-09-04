const _ = require('lodash');
const { getOptions } = require('loader-utils');
const { extname, relative, dirname, basename } = require('path');

module.exports = function(source) {
  const { entryMap, entry } = getOptions(this);
  const resourcePath = this.resourcePath;
  const entryKey = resourcePath.replace(extname(resourcePath), '').trim();

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
        importInject += `var ${val} = require('./${relativePath}').${val};exports.${val} = ${val};\n`;
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
