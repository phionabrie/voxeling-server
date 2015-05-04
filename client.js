var createClient = require('voxel-client')
var highlight = require('voxel-highlight')
var extend = require('extend')
var voxelPlayer = require('voxel-player')
var toolbar = require('toolbar')
var game


var client = function(opts, setup) {
  setup = setup || defaultSetup
  opts = extend({}, opts || {})

  var client = createClient(opts.server || "ws://localhost:8080/", opts)
  
  client.emitter.on('noMoreChunks', function(id) {
    console.log("Attaching to the container and creating player")
    var container = opts.container || document.body
    game = client.game
    game.appendTo(container)
    if (game.notCapable()) return game
    var createPlayer = voxelPlayer(game)

    // create the player from a minecraft skin file and tell the
    // game to use it as the main player
    var avatar = createPlayer(client.avatarImage)
    window.avatar = avatar
    avatar.possess()
    var settings = game.settings.avatarInitialPosition
    avatar.position.set(settings[0],settings[1],settings[2])
    setup(game, avatar, client)
  })

  return game
}

function defaultSetup(game, avatar, client) {
  // highlight blocks when you look at them, hold <Ctrl> for block placement
  var blockPosPlace, blockPosErase
  var currentMaterial = 1
  var hl = game.highlighter = highlight(game, { color: 0xff0000 })
  hl.on('highlight', function (voxelPos) { blockPosErase = voxelPos })
  hl.on('remove', function (voxelPos) { blockPosErase = null })
  hl.on('highlight-adjacent', function (voxelPos) { blockPosPlace = voxelPos })
  hl.on('remove-adjacent', function (voxelPos) { blockPosPlace = null })

  // toggle between first and third person modes
  window.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 'R'.charCodeAt(0)) avatar.toggle()
  })

/*
  game.on('fire', function (target, state) {
    var position = blockPosPlace
    if (position) {
      game.createBlock(position, currentMaterial)
      client.emitter.emit('set', position, currentMaterial)
    } else {
      position = blockPosErase
      if (position) {
        game.setBlock(position, 0)
        console.log("Erasing point at " + JSON.stringify(position))
        client.emitter.emit('set', position, 0)
      }
    }
  })
*/

  game.materialSelector = toolbar({el: '#tools'})
  game.materialSelector.on('select', function(item) {
    // This must be a number, or bad things happen
    currentMaterial = Number(item)
  })

  // right click block creation
  function raycast(dist) {
    dist = dist || 100
    var pos = game.cameraPosition()
    var vec = game.cameraVector()
    console.log(vec);
    return game.raycastVoxels(pos, vec, dist)
  }
  window.addEventListener('mousedown', function(e) {
    var position
    if (e.which === 1) {
      position = blockPosErase
      if (position) {
        game.setBlock(position, 0)
        console.log("Erasing point at " + JSON.stringify(position))
        client.emitter.emit('set', position, 0)
      }
    } else if (e.which === 3) {
      var hit = raycast()
      if (hit) {
        game.createBlock(hit.adjacent, currentMaterial)
      }
    }
  })
}

client({server: "ws://" + window.location.hostname + ":8080/"})