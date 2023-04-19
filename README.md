# 🦅 Raspberry Pi Bird Spotter

This is a javascript web server that is hosted on a
Raspberry Pi Zero 2 W with a cammera attached to it.

A pretrained neural model is combined with the live 
video feed from the Pi to recognise objects (particularly birds) and save their photos to the memory.

Later on their photos are displayed on the web page that 
can be accessed from any browser.

## Requirements

Here you will find a short list of requirements for this 
project.

### Hardware

- Bird feeder
- Raspberry Pi Zero 2 W
- Raspberry Pi Camera V3
- Raspberry Pi Zero Case

### Software

- Ubuntu Server x64 Lite
- Node.js v18+
- Python 3
- `make` with `build-essential`

## Get started

First, copy this repository locally to your Pi.

Now you can install the required packages:

```
npm i
```

After everything is set up without any errors you can
run the project locally:

```
npm run dev
```

And open your browser window on: `http://<pi-ip>:3000`.

## Credits

This project was developed by Markiian Benovskyi.
