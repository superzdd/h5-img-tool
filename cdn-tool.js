const { getAllFiles } = require('./util/tool.js');

const testPath = 'D:\\dev\\harbin-miniapp\\code\\trunk\\harbin-miniapp\\img';

/**
 * 将指定文件夹下的文件全部转换为cdn路径
 * @param {string} filePath - 指定文件夹的物理路径，绝对路径，如: D:\\dev\\harbin-miniapp\\code\\trunk\\harbin-miniapp\\img
 * @param {string} cdnPath - cdn路径，如: https://xxxcdn.abc.com/
 */
function cdn(filePath, cdnPath) {
    let arrFile = getAllFiles(filePath);
    let arrCdn = arrFile.map(f => {
        return f.replace(filePath, cdnPath).replace(/\\/g, '/');
    });

    return arrCdn;
}

module.exports.cdn = cdn;
