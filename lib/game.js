'use strict';

const
  util = require('util'),
  events = require('events'),
  Ball = require('./ball'),
  Paddle = require('./paddle');

function Game() {
  this.paddles = {
    player1: new Paddle(),
    player2: new Paddle()
  };

  this.ball = new Ball();

  this.bindEvents();
}

// Game will emit events for:
// - playerMiss, [playerId]
util.inherits(Game, events.EventEmitter);

Game.prototype.bindEvents = function() {

  let _this = this;
  let ball = this.ball;

  ball.on('player1WallCollision', function() {
    _this.detectPaddleCollision(1);
  });

  ball.on('player2WallCollision', function() {
    _this.detectPaddleCollision(2);
  });

};

Game.prototype.detectPaddleCollision = function(playerId) {
  if (this.hitPaddle(playerId)) {
    this.ball.changeXDirection();
    this.ball.setRandomSpeed();
  } else {
    this.recordMiss(playerId);
  }
};

Game.prototype.hitPaddle = function(player) {
  let paddle = this.paddles['player'+player];
  return (this.ball.y >= paddle.y - 20 && this.ball.y <= paddle.y + 20);
};

Game.prototype.recordMiss = function(playerId) {
  this.emit('playerMiss', playerId);
  this.ball.reset();
};

module.exports = Game;

