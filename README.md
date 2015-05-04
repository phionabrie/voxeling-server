Installation
===

It's not the easiest install, my apologies. We install all npm modules to the top-level `node_modules` folder (couldn't get npm dedupe to work) so that, for instance, when a change is made a change to the voxel repo, all modules that depend on it will be using the same modified code.

```
npm install beefy browserify duplex-emitter extend hat three minecraft-skin toolbar voxel-control voxel-crunch voxel-highlight voxel-mesh voxel-player voxel-raycast voxel-texture voxel-view websocket-stream ws inherits microtime tapes aabb-3d collide-3d-tilemap gl-matrix interact kb-controls pin-it raf spatial-events spatial-trigger tape tic voxel-physical voxel-region-change
```

Clone my forked repos somewhere:

```
git clone https://github.com/alanszlosek/voxel.git
git clone https://github.com/alanszlosek/voxel-server.git
git clone https://github.com/alanszlosek/voxel-client.git
git clone https://github.com/alanszlosek/voxel-engine.git
```

Now symlink each of those folders into the `node_modules` folder:

```
cd ~/node_modules/
rm -rf voxel-engine
ln -s /path/to/voxel ./voxel
ln -s /path/to/voxel-server ./voxel-server
ln -s /path/to/voxel-client ./voxel-client
ln -s /path/to/voxel-engine ./voxel-engine
```

Now clone the final repo:

```
git clone https://github.com/alanszlosek/voxeling-server.git
cd voxeling-server
```

Start the server: `node index.js`

In another terminal, start the client: `./client.sh`

Go to `http://localhost:9966` in your browser

Future Plans
===

* Have a game server I can self-host
* With a persistent world (backed by mysql, likely)
* So I can invite friends and members of my meetup to play around


