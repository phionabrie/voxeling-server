// Requires the latest checkout of https://github.com/kumavis/voxel-server. Not sure how it differs from npm version
var Server = require('voxel-server')
var chunkSize = 32
/*
var generator = require('voxel-simplex-terrain')({
    chunkDistance: 3,
    scaleFactor: 10,
    seed: 0.4658187120221555
})
*/
var websocket = require('websocket-stream')

var settings = {
  chunkSize: chunkSize,
  chunkDistance: 4,
  // various [voxel-engine]() settings to be sent to the clients
  avatarInitialPosition: [3, 60, 3],
  worldOrigin: [0,0,0],
  // list of incomming custom events to forward to all clients
  //forwardEvents: ['attack','voiceChat']

  // custom
  controls: {
    discreteFire: false,
    //speed: Number(1),
    //maxWalkSpeed: Number(10),
    //jumpSpeed: Number(.001),
    jumpMaxSpeed: Number(.010)
  },

/*
  avatarInitialPosition: [50,100,50],
  materials: ['grass', 'obsidian', 'dirt', 'whitewool', 'crate', 'brick', 'brick'],
  generateVoxelChunk: generator
*/

  generateChunks: true,
  // 1 block rise, each ring of chunks out from center
  generate: function(x, y, z) {
    var chunkX = Math.abs(Math.floor(x / chunkSize))
    var chunkY = Math.abs(Math.floor(y / chunkSize))
    var chunkZ = Math.abs(Math.floor(z / chunkSize))

    if (y == 0) {
      return 1
    }

    var out = Math.max(chunkX, chunkZ)
    if (y > 0 && y <= out) {
        return 1
    }
    return 0
  }

}

// create server
var server = Server(settings)

// Generate our first chunk

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


// These don't seem to work
// bind events
server.on('missingChunk', function(chunk){
  console.log('missing chunk');
return;
    var chunkSize = 32;
    chunk.voxels = generator(chunk.position, chunkSize)
    var chunk = {
      position: p,
      dims: [chunkSize, chunkSize, chunkSize],
      voxels: voxels
    }
    game.showChunk(chunk)
})
server.on('client.join', function(client){
    console.log('client join');
})
server.on('client.leave', function(client){
})
server.on('client.state', function(state){
    console.log('Client: ' + state);
})
server.on('chat', function(message){
})
server.on('set', function(pos, val, client){
})
server.on('error', function(error){
    console.log(error);
})

websocket.createServer({port: 8080}, function(stream) {
    console.log('hello');
    server.connectClient(stream);
})
