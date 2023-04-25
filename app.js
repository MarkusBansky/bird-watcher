// Require express
const express = require('express');
const app = express();

// Additional required modules
const {
    makeSnapshot,
    createFolderIfNotExists,
    getImages,
    generateThumbnails,
    deleteImageAndThumbnail
} = require('./functions');
const { isRunning, runCameraDetect } = require('./background');
const path = require('path');
const { clearInterval } = require('timers');

// create /public/images path if it does not exist
createFolderIfNotExists();

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
    deleteImageAndThumbnail(id);
    res.send('ok');
});

app.post('/snapshot', function (req, res) {
    makeSnapshot();
    res.send('ok');
});

/* istanbul ignore next */
if (!module.parent) {
    app.listen(3000);

    console.log('Express started on http://localhost:3000');
}

// Run background process
const detectLoop = setInterval(() => {
    isRunning('libcamera-detect', (running) => {
        if (!running) {
            runCameraDetect(signal);
        }
    });
}, 1000);

// Graceful shutdown
process.on('SIGINT', () => {
    controller.abort();
    clearInterval(detectLoop);
    process.exit();
});
process.on('SIGTERM', () => {
    controller.abort();
    clearInterval(detectLoop);
    process.exit();
});