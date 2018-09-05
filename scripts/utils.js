const jsonFile = require('jsonFile');
const fs = require('fs');
const uuid = require('uuid');
const { extname, join } = require('path');

function readJsonFile(baseUrl = '/') {
  return async function(file) {
    file = extname(file) ? file : `${file}.json`;
    file = join(baseUrl, file);
    if (fs.existsSync(file)) {
      return new Promise((resolve, reject) => {
        jsonFile.readFile(file, (err, obj) => {
          if (err) {
            return reject(err);
          }
          resolve(obj);
        });
      });
    }
    return {};
  }
}

function getEntryMap(entry = [], prefix = '_') {
  const entryMap = {};
  entry.forEach(item => entryMap[item] = prefix + uuid.v4().replace(/-/g, ''));
  return entryMap;
}

function getEntryKeyByResourceFile(resourceFile) {
  return resourceFile.replace(extname(resourceFile), '').trim();
}

module.exports = {
  readJsonFile,
  getEntryMap,
  getEntryKeyByResourceFile
}
