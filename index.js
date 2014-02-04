'use strict';

const
  express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  zmq = require('zmq'),
  io = require('socket.io').listen(server, {log: false}),
  Controller = require('./lib/controller'),
  Game = require('./lib/game');

// Configure Express app:
app.use(express.static(__dirname + '/public'));

// Initialize game instance:
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

// Setup controller emitters:
if (process.env.NODE_ENV === 'production') {
  var controller1 = new Controller('zmq', { address: 'tcp://192.168.0.2:9000' });
  var controller2 = new Controller('zmq', { address: 'tcp://192.168.0.2:9001' });
  controller1.emitter.on('player1Move', game.paddles.player1.move);
  controller1.emitter.on('player2Move', game.paddles.player2.move);
  controller2.emitter.on('player1Move', game.paddles.player1.move);
  controller2.emitter.on('player2Move', game.paddles.player2.move);
} else {
  var controller = new Controller('test', { game: game });
  controller.emitter.on('player1Move', game.paddles.player1.move);
  controller.emitter.on('player2Move', game.paddles.player2.move);
}

// === spray data to clients
// todo: use setImmediate or throttle nextTick/run-loop
// todo: combine into single message thread
setInterval(function() {
  clientEmit('player', game.paddles.player1);
  clientEmit('opponent', game.paddles.player2);
  clientEmit('ball', game.ball.getPosition());
}, 3);

// === start server
server.listen(3000);
console.log('Server started ---> listening on [localhost:3000]');

