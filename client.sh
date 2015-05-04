#!/bin/sh
node ~/node_modules/browserify/bin/cmd.js client.js -d > www/bundle.js
cd www
~/node_modules/beefy/bin/beefy 
