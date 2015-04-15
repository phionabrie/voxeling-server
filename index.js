var Server = require('voxel-server')
var perlin = require('voxel-perlin-terrain')
var generator = perlin(Date.now(), 0, 5, 20)
var websocket = require('websocket-stream')
var voxel = require('voxel')


var settings = {
  // various [voxel-engine]() settings to be sent to the clients
  avatarInitialPosition: [2, 20, 2],
  // list of incomming custom events to forward to all clients
  //forwardEvents: ['attack','voiceChat']

  //generateChunks: false
  //forwardEvents: { }
  generate: voxel.generator['Hill']
}

// create server
var server = Server(settings)


// bind events
server.on('missingChunk', function(chunk){
console.log('missing chunk');
    console.log(chunk);
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
