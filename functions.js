const fs = require('fs');
const sharp = require('sharp');

const IMG_WIDTH = 640;

function getImages() {
    const files = fs.readdirSync('./public/images');
    return files.filter(f => !f.includes('-thumb')).map(img => {
        const stats = fs.statSync('./public/images/' + img);
        return { img, thumbnail: img.split('.')[0] + '-thumb.jpg', birthtime: stats.birthtime, size: humanFileSize(stats.size, true, 2) };
    });
}

function generateThumbnails() {
    const files = fs.readdirSync('./public/images');
    const birds = files.filter(f => !f.includes('-thumb')).map(img => ({
        img,
        hasThumbnail: files.find(f => f.includes(img.split('.')[0] + '-thumb') && f.includes('.jpg'))
    }));

    birds.forEach(bird => {
        if (!bird.hasThumbnail) {
            sharp('./public/images/' + bird.img)
                .resize({ width: IMG_WIDTH })
                .toFile('./public/images/' + bird.img.split('.')[0] + '-thumb.jpg');
        }
    });
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

module.exports = {
    getImages,
    generateThumbnails,
    humanFileSize
}