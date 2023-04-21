// Require express
const express = require('express');
const app = express();

// Additional required modules
const path = require('path');
const shell = require('shelljs');
const fs = require('fs');

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
    const birds = fs.readdirSync('./public/images');
    res.render('index', { birds });
});

// Run background process
const detectProcess = shell
    .exec('libcamera-detect -t 0 -o ./public/images/bird-%06d.jpg --lores-width 400 --lores-height 300 --post-process-file object_detect_tf.json --object bird');

/* istanbul ignore next */
if (!module.parent) {
    app.listen(3000);
    console.log('Express started on port 3000');
}