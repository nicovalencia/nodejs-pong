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

  // Setup:
  this.resetScore();
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
    this.ball.updateSpeed(this.paddles['player'+playerId]);
  } else {
    this.recordMiss(playerId);
  }
};

Game.prototype.hitPaddle = function(player) {
  let paddle = this.paddles['player'+player];
  return (this.ball.y >= paddle.y - 20 && this.ball.y <= paddle.y + 20);
};

Game.prototype.resetScore = function() {
  this.lives = {
    player1: 3,
    player2: 3
  };
};

Game.prototype.removeLife = function(playerId) {
  let
    resetTimer = 3000,
    player = 'player' + playerId;

  this.lives[player]--;

  this.emit('playerMiss', playerId);

  if (this.lives[player] <= 0) {
    this.emit('over', this.lives);
    this.resetScore();
    resetTimer = 10000;
  }

  this.ball.reset({ waitFor: resetTimer });
};

Game.prototype.recordMiss = function(playerId) {
  this.removeLife(playerId);
};

module.exports = Game;

