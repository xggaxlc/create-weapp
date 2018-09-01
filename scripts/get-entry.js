const path = require('path');
const jsonFile = require('jsonFile');
const fs = require('fs');
const _ = require('lodash');
const { appRoot } = require('./config');

const { relative, extname, join } = path;

async function readJsonFile(file) {
  file = extname(file) ? file : `${file}.json`;
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

function getAbsolutePath(relativePath) {
  return join(appRoot, relativePath);
}

async function getEntry() {
  const appJson = join(appRoot, 'app.json');
  const appJs = join(appRoot, 'app');

  const { pages } = await readJsonFile(appJson);
  let entry = [appJs].concat(pages.map(getAbsolutePath));
  const getComponent = async(entryArr) => {
    const arr = _.uniq(
      _.flattenDeep(
        (await Promise.all(entryArr.map(readJsonFile)))
        .map(({ usingComponents = {} }) => _.map(usingComponents, getAbsolutePath))
      )
    );
    if (arr.length) {
      entry.push(arr);
      return getComponent(arr);
    }
  }

  await getComponent(entry);
  const entryObj = {};
   _.flattenDeep(entry).forEach(item => entryObj[getEntryName(item)] = item + '.ts');
  return entryObj;
}

function getEntryName(filename) {
  const ext = extname(filename);
  const basename = relative(appRoot, filename);
  return ext ? basename.replace(ext, '.js') : basename + '.js';
}

module.exports = {
  getEntryName,
  getEntry,
  readJsonFile
}
