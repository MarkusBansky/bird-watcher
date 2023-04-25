#!/bin/bash

# Update and upgrade
echo "Updating system"
sudo apt update
sudo apt upgrade -y

# Install node
echo "Installing node"
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Show versions
echo "Node version:"
node -v
echo "NPM version:"
npm -v

# Install node dependencies
echo "Installing node dependencies"
npm install

# Install essentials
echo "Installing essentials"
sudo apt install -y build-essential
sudo apt install -y unzip
sudo apt install -y git
sudo apt install -y gcc

# Download models required by this project
echo "Downloading models"
wget https://storage.googleapis.com/download.tensorflow.org/models/tflite/coco_ssd_mobilenet_v1_1.0_quant_2018_06_29.zip
unzip coco_ssd_mobilenet_v1_1.0_quant_2018_06_29.zip -d ./models
rm -rf coco_ssd_mobilenet_v1_1.0_quant_2018_06_29.zip

# Install tflite
echo "Installing tflite"
wget https://github.com/prepkg/tensorflow-lite-raspberrypi/releases/latest/download/tensorflow-lite.deb
sudo apt install -y ./tensorflow-lite.deb
rm -rf tensorflow-lite.deb

# Rebuild libcamera to have libcamera-detect
echo "Installing packages for building libcamera"
sudo apt install -y libcamera-dev libjpeg-dev libtiff5-dev
sudo apt install -y cmake libboost-program-options-dev libdrm-dev libexif-dev
# Download code
echo "Downloading library code"
cd
git clone https://github.com/raspberrypi/libcamera-apps.git
cd libcamera-apps
mkdir build
cd build
# Build
echo "Building library"
cmake .. -DENABLE_DRM=1 -DENABLE_X11=0 -DENABLE_QT=0 -DENABLE_OPENCV=0 -DENABLE_TFLITE=1
# Finish and install
echo "Installing library"
make -j1  # use -j1 on Raspberry Pi 3 or earlier devices
sudo make install
sudo ldconfig # this is only necessary on the first build

echo "Done"