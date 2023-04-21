const shell = require('shelljs');

shell.exec('libcamera-detect -t 0 -o ./public/images/bird-%06d.jpg --lores-width 400 --lores-height 300 --post-process-file object_detect_tf.json --object bird');
