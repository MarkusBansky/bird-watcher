const { spawn, exec } = require('node:child_process');

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

function runCameraDetect(signal) {
    spawn('libcamera-detect', [
        ' -t 0',
        '-o ./public/images/bird-%06d.jpg',
        '--lores-width 800',
        '--lores-height 600',
        '--post-process-file object_detect_tf.json',
        '--object bird'
    ], {
        detached: true,
        stdio: 'ignore',
        signal
    });
}

module.exports = {
    isRunning,
    runCameraDetect
};
