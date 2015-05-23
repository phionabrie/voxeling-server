// Requires the latest checkout of https://github.com/kumavis/voxel-server. Not sure how it differs from npm version
var Server = require('voxel-server')
var fs = require('fs')
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
  avatarInitialPosition: [16, 20, 16],
  worldOrigin: [0,0,0],
  fogDisabled: true,
  // list of incomming custom events to forward to all clients
  //forwardEvents: ['attack','voiceChat']

  // custom
  controls: {
    discreteFire: true, // Require mousedown/mouseup cycle to trigger fire
    //speed: Number(1),
    //maxWalkSpeed: Number(10),
    //jumpSpeed: Number(.001),
    jumpMaxSpeed: Number(.01)
  },

/*
  avatarInitialPosition: [50,100,50],
  generateVoxelChunk: generator
*/

  materials: [['grass','grass_dirt', 'dirt'], 'brick', 'dirt', 'obsidian', 'whitewool', 'water', 'lava', 'crate'],

  avatarInitialPosition: [16, 100, 16],
  generateVoxelChunk: function(chunkInfo, callback) {
    var self = this
    var chunkID = chunkInfo.chunkID
    fs.readFile('/Users/alanszlosek/Projects/voxeling-server/chunks/' + chunkID.replace(/\|/g, '.'), function(err, data) {
      if (err) {
        // File not found, generate normally
        self._generateVoxelChunk(chunkInfo, callback)
        return
      }
      callback(null, data)
    });
  },

/*
  // Hilly Terrain
  generate: function(i,j,k) {
  var h0 = 3.0 * Math.sin(Math.PI * i / 12.0 - Math.PI * k * 0.1) + 27;    
  if(j > h0+1) {
    return 0; // nothing
  }
  if(h0 <= j) {
    return 1; // grass
  }
  var h1 = 2.0 * Math.sin(Math.PI * i * 0.25 - Math.PI * k * 0.3) + 20;
  if(h1 <= j) {
    return 2;
  }
  if(2 < j) {
    return Math.random() < 0.1 ? 0x222222 : 0xaaaaaa;
  }
  return 3;
}*/

  
  // 1 block rise, each ring of chunks out from center
  generate: function(x, y, z) {
    var chunkX = Math.abs(Math.floor(x / chunkSize))
    var chunkY = Math.abs(Math.floor(y / chunkSize))
    var chunkZ = Math.abs(Math.floor(z / chunkSize))

    if (y == 0) {
      return 1 // grass and dirt
    }
    if (y > -20 && y < 0) {
      return 3 // dirt
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

server.on('missingChunk', function(chunk){
  console.log('missing chunk');
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
server.on('flushChunk', function(chunkID, chunk) {
  chunk.hasChanges = false;
  fs.writeFile('/Users/alanszlosek/Projects/voxeling-server/chunks/' + chunkID.replace(/\|/g, '.'), new Buffer(chunk.voxels), function(err) {
    if (err) {
      return console.log(err)
    }
    console.log('Saved chunk ' + chunkID);
  });
})


websocket.createServer({port: 8080}, function(stream) {
    console.log('hello');
    server.connectClient(stream);

  // handle websocket close / user left
  stream.on('close', function(error) {
    console.log('stream closed')
    server.removeClient(stream.id)
  })
})
