const tinify = require('tinify');
tinify.key = 'QXY6XWxphHqbTWakk0NebYIp36ErxJDz';

const path = require('path');
const fs = require('fs');
const { getAllFiles } = require('./util/tool.js');

const testPath =
    '/Users/zhangchenhai/herdsric/hennessy-midautumn-h5-2020/素材/20200708/3-活动界面/';

const getImageName = function (p) {
    let fileInfo = path.parse(p);

    if (
        fileInfo.ext.includes('jpg') ||
        fileInfo.ext.includes('png') ||
        fileInfo.ext.includes('gif')
    ) {
        let name = path.parse(p).name;
        name = name.replace(/ /g, '-').replace(/_/g, '-').toLowerCase();

        // 校验名称不能以数字开头
        if (RegExp(/[0-9]/).test(name[0])) {
            name = 'num-' + name;
        }

        return name;
    } else {
        return null;
    }
};

const listAllImage = async function (files = []) {
    let listCss = [];
    for (let i = 0; i < files.length; i++) {
        let f = files[i];
        // console.log(`file: ${f}`);
        let name = getImageName(f);

        if (!name) {
            continue;
        }

        try {
            listCss.push({
                name,
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

const makeTiny = function (list) {
    list.forEach((f) => {
        const source = tinify.fromFile(f.path);
        source.toFile(f.path);
        console.log(`tinified ${f.name} success`);
    });
};

const makeTinyImages = async function (path) {
    let files = getAllFiles(path);
    // let fileId = Date.now();
    let list = await listAllImage(files);
    console.log(list);

    makeTiny(list);
};

makeTinyImages(testPath);
