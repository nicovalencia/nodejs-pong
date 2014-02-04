'use strict';

const
  express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  zmq = require('zmq'),
  io = require('socket.io').listen(server, {log: false}),
  Game = require('./lib/game');

// === config
app.use(express.static(__dirname + '/public'));

// === Initialize Game:
// todo: build game queue to begin new game for each set of 2 players.
const game = new Game();

game.on('playerMiss', function(playerId) {
  console.log('Player ['+playerId+'] missed the ball!');
  clientEmit('playerMiss', { playerId: playerId, lives: game.lives })
});

game.on('over', function(lives) {
  console.log('Game over! Score [player1: '+lives.player1+' lives] || [player2: '+lives.player2+' lives].');
  clientEmit('over', { lives: lives })
});

// Add new sockets to client pool:
const clients = {};
io.sockets.on('connection', function(socket) {
  clients[socket.id] = socket;
  socket.on('disconnect', function() {
    delete clients[socket.id];
  });
});

// Setup emitter hook:
function clientEmit(msg, data) {
  for (let clientId in clients) {
    let socket = clients[clientId];
    socket.emit(msg, data);
  }
}

// === WIIMOTE SUBSCRIBER
function buildSubscriber(address) {
  let subscriber = zmq.socket('sub');

  subscriber.subscribe('');

  subscriber.on('message', function(data) {
    let speed = 5
    let msg = JSON.parse(data.toString());
    let player = msg.nunchuck == 1 ? game.paddles.player1 : game.paddles.player2

    if (msg.nunchuck == 1) {
      player.y -= msg.x * speed
    }
    else {
      player.y += msg.x * speed
    }

    if (player.y > 80) player.y = 80;
    if (player.y < -80) player.y = -80;
  });

  subscriber.connect(address);

  return subscriber;
}

// === build wiimote subscribers
buildSubscriber('tcp://192.168.0.2:9000');
buildSubscriber('tcp://192.168.0.2:9001');

// === spray data to clients
// todo: use setImmediate or throttle nextTick/run-loop
// todo: combine into single message thread
setInterval(function() {
  clientEmit('player', game.paddles.player1);
  clientEmit('opponent', game.paddles.player2);
  clientEmit('ball', game.ball.getPosition());
}, 1);

// === start server
server.listen(3000);
console.log('Server started ---> listening on [localhost:3000]');

