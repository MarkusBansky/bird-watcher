// Require express
const express = require('express');
const app = express();

// Additional required modules
const { getImages, generateThumbnails } = require('./functions');
const { spawn } = require('node:child_process');
const path = require('path');
const fs = require('fs');

// create /public/images path if it does not exist
if (!fs.existsSync('./public/images')) {
    fs.mkdirSync('./public/images');
}

// some propeties
const controller = new AbortController();
const { signal } = controller;

// Set up the server
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
app.set('view engine', 'html');

// Paths
app.get('/', function (req, res) {
    generateThumbnails();
    const birds = getImages();
    res.render('index', { birds });
});

app.delete('/:id', function (req, res) {
    const { id } = req.params;
    const filename = id.replace('.jpg', '');

    console.log(filename);

    const files = fs.readdirSync('./public/images');

    const bird = files.find(f => f.includes(filename) && !f.includes('-thumb'));
    const birdThumb = files.find(f => f.includes(filename + '-thumb'));

    const p1 = path.join(__dirname, 'public/images', bird);
    const p2 = path.join(__dirname, 'public/images', birdThumb);

    fs.unlinkSync(p1);
    fs.unlinkSync(p2);

    res.send('ok');
});

/* istanbul ignore next */
if (!module.parent) {
    app.listen(3000);

    // Run background process
    spawn('node', ['background.js'], {
        detached: true,
        stdio: 'ignore',
        signal
    });

    console.log('Express started on http://localhost:3000');
}

// Graceful shutdown
process.on('SIGINT', () => {
    controller.abort();
    process.exit();
});
process.on('SIGTERM', () => {
    controller.abort();
    process.exit();
});