// Require express
const express = require('express');
const app = express();

// Additional required modules
const { spawn } = require('node:child_process');
const path = require('path');
const fs = require('fs');

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
    const birds = fs.readdirSync('./public/images');
    res.render('index', { birds });
});

// Run background process
const camProcess = spawn('node', ['background.js'], {
    detached: true,
    stdio: 'ignore',
    signal
});
// detach from the child process
camProcess.unref();
// shutdown callback
process.on('exit', function () {
    camProcess.abort();
});

/* istanbul ignore next */
if (!module.parent) {
    app.listen(3000);
    console.log('Express started on port 3000');
}