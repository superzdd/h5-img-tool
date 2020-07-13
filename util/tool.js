const fs = require('fs');
const path = require('path');

/**
 * 扫描绝对路径下文件夹里的所有文件，包含子文件夹中的文件，返回所有的文件路径
 * @param {*} filePath 文件夹路径
 * @param {*} arrFile 所有文件的绝对路径数组
 */
function getAllFiles(filePath, arrFile = []) {
    let stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
        let arr = fs.readdirSync(filePath);

        arr.forEach(f => {
            let newFilePath = path.join(filePath, f);
            getAllFiles(newFilePath, arrFile);
        });
    } else {
        arrFile.push(filePath);
    }

    return arrFile;
}

module.exports.getAllFiles = getAllFiles;
