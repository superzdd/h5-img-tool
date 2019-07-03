const { cdn } = require('./cdn-tool.js');
const fs = require('fs');

// 将文件夹中所有的图片文件输出成cdn路径

var documentRoot = 'D:\\dev\\harbin-miniapp\\code\\trunk\\harbin-miniapp\\img';
var cdnRoot = 'https://hapicdn.herdsric.com/harbin1/harbin-miniapp/img';
const cdnArray = cdn(documentRoot, cdnRoot);
console.log(`file count: ${cdnArray.length}`);
let outputPath = documentRoot + '\\cdn-all-' + Date.now() + '.js';
fs.writeFileSync(outputPath, cdnArray.join('\r\n'));
console.log(`write to file complete: ${outputPath}`);
