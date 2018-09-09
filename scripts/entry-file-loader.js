const fs = require('fs');
const { getOptions } = require('loader-utils');
const { basename } = require('path');
const { getEntryKeyByResourceFile } = require('./utils');

module.exports = function(source) {
  const { entryMap, entry, exts } = getOptions(this);
  const resourcePath = this.resourcePath;
  const entryKey = getEntryKeyByResourceFile(resourcePath);

  let importInject = '';
  if (entryMap[entryKey]) {
    exts.forEach(ext => {
      const file = `${entryKey}.${ext}`;
      if (fs.existsSync(file)) {
        importInject += `require('./${basename(file)}');\n`
      }
    });
  }
  return `
${importInject}
${source}
  `;
}
