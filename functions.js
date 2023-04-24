const fs = require('fs');
const sharp = require('sharp');

const IMG_WIDTH = 480;

function getImages() {
    const files = fs.readdirSync('./public/images');
    return files.filter(f => !f.includes('-thumb')).map(img => ({
        img,
        thumbnail: img.split('.')[0] + '-thumb.jpg'
    }));
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

module.exports = {
    getImages,
    generateThumbnails
}