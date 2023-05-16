const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const shell = require('shelljs');
const { exec } = require('node:child_process');

const IMG_WIDTH = 640;
const IMAGES_PATH = './public/images';
const THUMBNAIL_SUFFIX = '-thumb';
const IMAGE_EXTENTION = '.jpg';

function getImgPath(str) {
    return path.join(__dirname, IMAGES_PATH, str);
}

function getThumbPath(str) {
    return path.join(__dirname, IMAGES_PATH, getThumbName(str));
}

function getThumbName(str) {
    return str.replace(IMAGE_EXTENTION, '') + `${THUMBNAIL_SUFFIX}.jpg`;
}

function createFolderIfNotExists() {
    if (!fs.existsSync(IMAGES_PATH)) {
        fs.mkdirSync(IMAGES_PATH);
    }
}

function getImages() {
    const files = fs.readdirSync(IMAGES_PATH);
    return files.filter(f => !f.includes(THUMBNAIL_SUFFIX)).map(img => {
        const stats = fs.statSync(getImgPath(img));
        return {
            img,
            thumbnail: getThumbName(img),
            birthtime: new Date(stats.birthtime).toLocaleString('en-GB'),
            size: humanFileSize(stats.size, true, 2),
            hasThumbnail: files.find(f => f.includes(getThumbName(img)) && f.includes(IMAGE_EXTENTION))
        };
    });
}

function wait(ms) {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
        now = Date.now();
    }
}

function generateThumbnails() {
    const files = getImages();

    files.forEach(bird => {
        if (!bird.hasThumbnail) {
            try {
                sharp(getImgPath(bird.img))
                    .resize({ width: IMG_WIDTH })
                    .toFile(getThumbPath(bird.img));
                wait(1000);
            } catch (e) {
                console.error(e);
            }
        }
    });
}

function deleteImageAndThumbnail(filename) {
    fs.unlinkSync(getImgPath(filename));
    fs.unlinkSync(getThumbPath(filename));
}

function humanFileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}

function isRunning(query, cb) {
    let platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32': cmd = `tasklist`; break;
        case 'darwin': cmd = `ps -ax | grep ${query}`; break;
        case 'linux': cmd = `ps -A`; break;
        default: break;
    }
    exec(cmd, (err, stdout, stderr) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
}

module.exports = {
    createFolderIfNotExists,
    deleteImageAndThumbnail,
    getImages,
    generateThumbnails,
    humanFileSize,
    isRunning
}