const path = require('path');
const fs = require('fs');
const { getAllFiles } = require('./util/tool.js');
const getPixels = require('get-pixels');

const testPath = 'D:\\dev\\harbin-miniapp\\code\\trunk\\harbin-miniapp\\img';

const designPxWidth = 750;
const designRpxWidth = 750;
const designRemRatio = 10; // 750/10

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
        return null;
    }
};

const genStrWidthHeight = function(w, h) {
    return `{width: ${w}; height: ${h}}`;
};

const getRpxSize = function(w, h) {
    return genStrWidthHeight(`${w}rpx`, `${h}rpx`);
};

const getRemSize = function(w, h) {
    let newW = (w / designRemRatio).toFixed(2) + 'rem';
    let newH = (h / designRemRatio).toFixed(2) + 'rem';

    return genStrWidthHeight(`${newW}`, `${newH}`);
};

const getPercentSize = function(w, h) {
    let wPercent = (w / designPxWidth) * 100;
    let newW = wPercent.toFixed(2);
    let newH = `calc( ${(h / w).toFixed(2)} * ${newW}vw)`;

    return genStrWidthHeight(`${newW}%`, `${newH}`);
};

const getPixelsPromise = function(filePath) {
    return new Promise(res => {
        getPixels(filePath, function(err, pixels) {
            res(pixels);
        });
    });
};

const listAllImage = async function(root, id, files = []) {
    let listCss = [];
    for (let i = 0; i < files.length; i++) {
        let f = files[i];
        // console.log(`file: ${f}`);
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
            console.log(f);
            console.log(ex);
        }
    }

    console.log('come to end');
    return listCss;
};

const makeCssFilePercent = function(list, id, root) {
    let filePath = path.join(root, 'app-percent-' + id + '.css');

    fs.writeFileSync(filePath, '/** css percent */');

    list.forEach(f => {
        let str = `.${f.name} ${getPercentSize(f.width, f.height)}\r\n`;
        fs.appendFileSync(filePath, str);
    });

    console.log(`generate file complete: ${filePath}`);
};

const makeCssFileRem = function(list, id, root) {
    let filePath = path.join(root, 'app-rem-' + id + '.css');

    fs.writeFileSync(filePath, '/** css rem */');

    list.forEach(f => {
        let str = `.${f.name} ${getRemSize(f.width, f.height)}\r\n`;
        fs.appendFileSync(filePath, str);
    });

    console.log(`generate file complete: ${filePath}`);
};

const makeCssFileRpx = function(list, id, root) {
    let filePath = path.join(root, 'app-rpx-' + id + '.css');

    fs.writeFileSync(filePath, '/** css rpx */');

    list.forEach(f => {
        let str = `.${f.name} ${getRpxSize(f.width, f.height)}\r\n`;
        fs.appendFileSync(filePath, str);
    });

    console.log(`generate file complete: ${filePath}`);
};

const makeHtml = function(list, id, root) {
    let filePath = path.join(root, 'index-' + id + '.html');

    fs.writeFileSync(filePath, '');

    list.forEach(f => {
        let str = `<img src=\'${f.path}\' class=\'${f.name}\'>\r\n`;
        fs.appendFileSync(filePath, str);
    });

    console.log(`generate file complete: ${filePath}`);
};

const makeCss = async function(path) {
    let files = getAllFiles(path);
    let fileId = Date.now();
    let list = await listAllImage(path, fileId, files);

    makeCssFilePercent(list, fileId, path);
    makeCssFileRem(list, fileId, path);
    makeCssFileRpx(list, fileId, path);
    makeHtml(list, fileId, path);
};

makeCss(testPath);
