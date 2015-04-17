// Requires the latest checkout of https://github.com/kumavis/voxel-server. Not sure how it differs from npm version
var Server = require('/Users/alanszlosek/Projects/voxel-server')
//var generator = require('voxel-perlin-terrain')('moo', 0, 5)
var generator = require('voxel-simplex-terrain')({
    chunkDistance: 2,
    chunkSize: 32,
    seed: 98237498723987234
})
var websocket = require('websocket-stream')
var voxel = require('voxel')

var settings = {
  // various [voxel-engine]() settings to be sent to the clients
  avatarInitialPosition: [3, 60, 3],
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
  generateVoxelChunk: generator
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
