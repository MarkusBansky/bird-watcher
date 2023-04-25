const TEN_SECONDS = 10000;

// Require express
const express = require('express');
const app = express();

// Additional required modules
const {
    isRunning,
    createFolderIfNotExists,
    getImages,
    generateThumbnails,
    deleteImageAndThumbnail
} = require('./functions');
const path = require('path');
const shell = require('shelljs');
const { clearInterval } = require('timers');

// create /public/images path if it does not exist
createFolderIfNotExists();

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

// Background process
function backgroundProcess() {
    // check if libcamera is running
    isRunning('libcamera-detect', (running) => {
        console.log(`libcamera-detect health check: ${running}`);
        if (!running) {
            console.log('Launching libcamera-detect process...');
            // Run background process
            shell.exec('libcamera-detect -t 0 -o ./public/images/bird-%06d.jpg --lores-width 800 --lores-height 600 --post-process-file object_detect_tf.json --object bird', function (code, stdout, stderr) {
                console.log('Exit code:', code);
                console.log('Program output:', stdout);
                console.log('Program stderr:', stderr);
            });
            console.log('Process launched.');
        }
    });
}

let detectLoop;
/* istanbul ignore next */
if (!module.parent) {
    app.listen(3000);

    // create a loop to check if libcamera is running
    detectLoop = setInterval(backgroundProcess, TEN_SECONDS);
    // run it on the first start of the app
    backgroundProcess();

    // log to console to let us know it's working
    console.log('Express started on http://localhost:3000');
}

// Graceful shutdown
process.on('SIGINT', () => {
    clearInterval(detectLoop);
    process.exit();
});
process.on('SIGTERM', () => {
    clearInterval(detectLoop);
    process.exit();
});