const _ = require('lodash');
const { join, isAbsolute, dirname } = require('path');
const { readJsonFile } = require('./utils');

async function getEntry(appRoot) {
  const readJson = readJsonFile(appRoot);
  const { pages } = await readJson('/app');
  let entry = [
    '/app',
    ...pages.map(page => page.startsWith('/') ? page : `/${page}`)
  ];

  const getComponent = async(entryArr) => {
    const componentsJsonWithPath = await Promise.all(
      entryArr.map(async (path) => {
        const json = await readJson(path);
        return {
          path,
          json
        }
      })
    );

    const componentsArr = componentsJsonWithPath.map(({ path, json }) => {
      const { usingComponents = {} } = json;
      return _.map(usingComponents, componentPath => {
        // 绝对路径和相对路径判断
        return isAbsolute(componentPath) ? componentPath : join(dirname(path), componentPath);
      });
    });

    const arr = _.uniq(_.flattenDeep(componentsArr));
    if (arr.length) {
      entry = entry.concat(arr);
      return getComponent(arr);
    }
  }

  await getComponent(entry);
  return _.uniq(entry).map(relativePath => join(appRoot, relativePath)).sort();
}

module.exports = getEntry;
