# 🦅 Raspberry Pi Bird Spotter

This is a javascript web server that is hosted on a
Raspberry Pi Zero 2 W with a cammera attached to it.

A pretrained neural model is combined with the live
video feed from the Pi to recognise objects (particularly birds) and save their photos to the memory.

Later on their photos are displayed on the web page that
can be accessed from any browser.

## Requirements

Here you will find a short list of requirements for this project.

### Hardware

- Raspberry Pi
- Raspberry Pi Camera

### Software

- Raspberry Pi OS Lite

## Get started

First, copy this repository locally to your Pi.

Now you can install the required software:

```
./install.sh
```

> In case you have any problems with the script, please file a bug.

> If you are running a different OS to the one specified or want to experiment with this project then you should modify the build stack.

After everything is set up without any errors you can
run the project locally:

```
node app.js
```

And open your browser window on: `http://<pi-ip>:3000`.

## Credits

This project was developed by Markiian Benovskyi.
