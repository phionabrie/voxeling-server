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
var chunkSize = 32

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

/*
  generate: function(x,y,z) {
    var width = chunkSize
    // Shift negative values into positive space ... 0 to chunkSize
    var xidx = (width + x % width) % width
    var yidx = (width + y % width) % width
    var zidx = (width + z % width) % width
    var idx = xidx + (yidx * width) + (zidx * width * width)
    var chunkIndex = [
        Math.floor(x/chunkSize),
        Math.floor(y/chunkSize),
        Math.floor(z/chunkSize)
    ]
    var lo = chunkIndex.map(function(i) {
        return i * chunkSize;
    })
    var hi = lo.map(function(i) {
        return i + chunkSize;
    })
    // which chunk are we at?
    var chunkPosition = chunkIndex.join('|')
    var data
    if (!(chunkPosition in voxelsByChunk)) {
        console.log('Generating chunk ' + chunkPosition)
        voxelsByChunk[chunkPosition] = generator(lo, hi)
        //console.log(voxelsByChunk[chunkPosition])
    }
    if (idx < 0 || idx > maxVoxelIndex) {
        console.log('Fetching voxel at ' + idx);
    }
    return voxelsByChunk[chunkPosition][idx]
  }
*/


  // should run a test with a function that generates a base floor at y=1, but every x%2 is 1 voxel higher
  //generate: voxelTypeChooser
  /*
  generate: function(x,y,z) {
    var width = chunkSize
    // Shift negative values into positive space ... 0 to chunkSize
    var xidx = (width + x % width) % width
    var yidx = (width + y % width) % width
    var zidx = (width + z % width) % width
    var idx = xidx + (yidx * width) + (zidx * width * width)
    // which chunk are we at?
    var chunkPosition = '' + Math.floor(x/chunkSize)
        + '|'
        + Math.floor(y/chunkSize)
        + '|'
        + Math.floor(z/chunkSize)
    var data
    if (!(chunkPosition in voxelsByChunk)) {
        console.log('Generating chunk ' + chunkPosition)
        voxelsByChunk[chunkPosition] = generator([x, y, z], chunkSize)
    }
    if (idx < 0 || idx > maxVoxelIndex) {
        console.log('Fetching voxel at ' + idx);
    }
    return voxelsByChunk[chunkPosition][idx]
  }
  */
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
