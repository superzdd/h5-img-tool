const path = require('path');
const fs = require('fs');
const { getAllFiles } = require('./util/tool.js');
const getPixels = require('get-pixels');

const testPath = 'D:\\herdsric\\中原银行\\素材';

const designPxWidth = 750;
const designRpxWidth = 750;
const designRemRatio = 10; // 750/10

/**
 * 获取图片名称，如果不是图片文件则返回null
 * 图片指的是jpg,png,gif
 * @param {string} p 文件绝对路径
 */
const getImageName = function(p) {
    let fileInfo = path.parse(p);

    if (
        fileInfo.ext.includes('jpg') ||
        fileInfo.ext.includes('png') ||
        fileInfo.ext.includes('gif')
    ) {
        let name = path.parse(p).name;
        name = name
            .replace(/ /g, '-')
            .replace(/_/g, '-')
            .toLowerCase();

        // 校验名称不能以数字开头
        if (RegExp(/[0-9]/).test(name[0])) {
            name = 'num-' + name;
        }

        return name;
    } else {
        console.log(`${p} is not a image`);
        return null;
    }
};

/**
 * 生成css样式的width,height字符串
 * @param {string} w
 * @param {string} h
 */
const genStrWidthHeight = function(w, h) {
    return `{width: ${w}; height: ${h}}`;
};

/**
 * 生成相对应的rpx宽高
 * @param {int} w 宽度px
 * @param {int} h 高度px
 */
const getRpxSize = function(w, h) {
    const scale = 750 / designPxWidth; // 小程序上默认宽度为750rpx, 所有设计图宽度要根据750进行缩放
    let newW = (w * scale).toFixed(2);
    let newH = (h * scale).toFixed(2);

    return genStrWidthHeight(`${newW}rpx`, `${newH}rpx`);
};

/**
 * 生成相对应的rem宽高
 * @param {int} w 宽度px
 * @param {int} h 高度px
 */
const getRemSize = function(w, h) {
    let newW = (w / designRemRatio).toFixed(2) + 'rem';
    let newH = (h / designRemRatio).toFixed(2) + 'rem';

    return genStrWidthHeight(`${newW}`, `${newH}`);
};

/**
 * 生成相对应的百分比宽高
 * @param {int} w 宽度px
 * @param {int} h 高度px
 */
const getPercentSize = function(w, h) {
    let wPercent = (w / designPxWidth) * 100;
    let newW = wPercent.toFixed(2);
    let newH = `calc( ${(h / w).toFixed(2)} * ${newW}vw)`;

    return genStrWidthHeight(`${newW}%`, `${newH}`);
};

/**
 * 使用promise封装getPixels对象
 * @param {string} filePath 文件绝对路径
 */
const getPixelsPromise = function(filePath) {
    return new Promise(res => {
        getPixels(filePath, function(err, pixels) {
            res(pixels);
        });
    });
};

/**
 * 列出文件列表中每个图片文件的基础属性(名称，宽，高，路径...)
 * @param {string} files 文件列表
 */
const listImageBasicInfo = async function(files = []) {
    let listCss = [];
    for (let i = 0; i < files.length; i++) {
        let f = files[i];
        console.log(`file: ${f}`);
        let name = getImageName(f);

        if (!name) {
            continue;
        }

        try {
            let pixels = await getPixelsPromise(f);
            let width = pixels.shape[0];
            let height = pixels.shape[1];
            listCss.push({
                name,
                width,
                height,
                path: f,
            });
        } catch (ex) {
            console.log(`get file error: ${{ f }}`);
            console.log(ex);
        }
    }

    return listCss;
};

/**
 * 生成css文件，宽度单位为百分比
 * @param {array} list 图片文件基础信息列表
 * @param {string} id 生成文件批次号
 * @param {string} root 生成文件的目录
 */
const makeCssFilePercent = function(list, id, root) {
    let filePath = path.join(root, 'app-percent-' + id + '.css');

    fs.writeFileSync(filePath, '/** css percent */');

    list.forEach(f => {
        let str = `.${f.name} ${getPercentSize(f.width, f.height)}\r\n`;
        fs.appendFileSync(filePath, str);
    });

    console.log(`generate file complete: ${filePath}`);
};

/**
 * 生成css文件，宽度单位为rem
 * @param {array} list 图片文件基础信息列表
 * @param {string} id 生成文件批次号
 * @param {string} root 生成文件的目录
 */
const makeCssFileRem = function(list, id, root) {
    let filePath = path.join(root, 'app-rem-' + id + '.css');

    fs.writeFileSync(filePath, '/** css rem */');

    list.forEach(f => {
        let str = `.${f.name} ${getRemSize(f.width, f.height)}\r\n`;
        fs.appendFileSync(filePath, str);
    });

    console.log(`generate file complete: ${filePath}`);
};

/**
 * 生成css文件，宽度单位为rpx
 * @param {array} list 图片文件基础信息列表
 * @param {string} id 生成文件批次号
 * @param {string} root 生成文件的目录
 */
const makeCssFileRpx = function(list, id, root) {
    let filePath = path.join(root, 'app-rpx-' + id + '.css');

    fs.writeFileSync(filePath, '/** css rpx */');

    list.forEach(f => {
        let str = `.${f.name} ${getRpxSize(f.width, f.height)}\r\n`;
        fs.appendFileSync(filePath, str);
    });

    console.log(`generate file complete: ${filePath}`);
};

/**
 * 生成html文件，其中包含所有图片的<img>标签
 * @param {array} list 图片文件基础信息列表
 * @param {string} id 生成文件批次号
 * @param {string} root 生成文件的目录
 */
const makeHtml = function(list, id, root) {
    let filePath = path.join(root, 'index-' + id + '.html');

    fs.writeFileSync(filePath, '');

    list.forEach(f => {
        let str = `<img src=\'${f.path}\' class=\'${f.name}\'>\r\n`;
        fs.appendFileSync(filePath, str);
    });

    console.log(`generate file complete: ${filePath}`);
};

/**
 * 生成所有图片的css宽高
 * @param {string} p 图片所在目录，绝对路径
 */
const makeCss = async function(p) {
    let files = getAllFiles(p);
    let fileId = Date.now();

    let list = await listImageBasicInfo(files);

    let folderPath = path.join(p, '' + fileId);

    fs.mkdirSync(folderPath);

    makeCssFilePercent(list, fileId, folderPath);
    makeCssFileRem(list, fileId, folderPath);
    makeCssFileRpx(list, fileId, folderPath);
    makeHtml(list, fileId, folderPath);
};

makeCss(testPath);
