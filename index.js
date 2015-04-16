// Requires the latest checkout of https://github.com/kumavis/voxel-server. Not sure how it differs from npm version
var Server = require('/Users/alanszlosek/Projects/voxel-server')
var perlin = require('voxel-perlin-terrain')
var generator = perlin('moo', 0, 5, 20)
var websocket = require('websocket-stream')
var voxel = require('voxel')
var ndarray = require('ndarray')
var chunkSize = 32
var voxelsByChunk = {
}
//var generator = voxel.generator['Hilly Terrain']

var settings = {
  // various [voxel-engine]() settings to be sent to the clients
  avatarInitialPosition: [0, 60, 0],
  // list of incomming custom events to forward to all clients
  //forwardEvents: ['attack','voiceChat']

  // custom
  //generateChunks: false,
  //generate: voxel.generator['Hill'],
  controls: {
    discreteFire: false,
    //speed: Number(1),
    //maxWalkSpeed: Number(10),
    //jumpSpeed: Number(.001),
    jumpMaxSpeed: Number(.010)
  },
  generate: function(x,y,z) {
    var xx = Math.abs(x % chunkSize)
    var yy = Math.abs(y % chunkSize)
    var zz = Math.abs(z % chunkSize)
    // which chunk are we at?
    var chunkPosition = '' + Math.floor(x/chunkSize)
        + '|'
        + Math.floor(y/chunkSize)
        + '|'
        + Math.floor(z/chunkSize)
    var data
    if (!(chunkPosition in voxelsByChunk)) {
        console.log('Generating chunk ' + chunkPosition)
        voxelsByChunk[chunkPosition] = generator([xx, yy, zz], chunkSize)
    }
    data = voxelsByChunk[chunkPosition]
    return data[xx + yy*chunkSize + zz*chunkSize*chunkSize]
  }
}

// create server
var server = Server(settings)

// Generate our first chunk

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/* 
  game.voxels.on('missingChunk', function(p) {
    var chunkSize = 32;
    var voxels = generator(p, chunkSize)
    var chunk = {
      position: p,
      dims: [chunkSize, chunkSize, chunkSize],
      voxels: voxels
    }
    game.showChunk(chunk)
  })
*/

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
