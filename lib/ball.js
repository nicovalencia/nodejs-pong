'use strict';

const
  util = require('util'),
  events = require('events'),
  MINIMUM_SPEED = 0.1,
  MAXIMUM_SPEED = 0.5,
  DEFAULT_SPEED = 0.1;

function Ball() {
  this.reset();
}

// Ball will emit events for:
// - player1WallCollision
// - player2WallCollision
util.inherits(Ball, events.EventEmitter);

Ball.prototype.setRandomSpeed = function() {
  this.speedY = (Math.random() * (MAXIMUM_SPEED - MINIMUM_SPEED)) + MINIMUM_SPEED;
  this.speedX = (Math.random() * (MAXIMUM_SPEED - MINIMUM_SPEED)) + MINIMUM_SPEED;
};

Ball.prototype.changeXDirection = function() {
  this.dirX *= -1;
};

// Y - Side wall collision, reverse direction:
Ball.prototype.detectYCollision = function() {
  if (this.y > 100) {
    this.y = 100;
    this.dirY *= -1;
  } else if (this.y < -100) {
    this.y = -100;
    this.dirY *= -1;
  }
};

// X - Player/Opponent wall collision:
// - set score if paddle misses ball
// - change velocity / direction if paddle hits ball
Ball.prototype.detectXCollision = function() {
  if (this.x > 100) {
    this.x = 100;
    this.emit('player1WallCollision');
  } else if (this.x < -100) {
    this.x = -100;
    this.emit('player2WallCollision');
  }
};

Ball.prototype.getDelta = function() {
  let time = Date.now();
  let delta = time - this.ts;

  this.ts = time;

  return delta;
};

Ball.prototype.updatePosition = function() {
  let delta = this.getDelta();

  this.x = (this.x += this.dirX * this.speedX * delta);
  this.y = (this.y += this.dirY * this.speedY * delta);

  this.detectYCollision();
  this.detectXCollision();
};

Ball.prototype.getPosition = function() {
  this.updatePosition();

  return {
    x: this.x,
    y: this.y
  }
};

Ball.prototype.reset = function() {
  this.ts = Date.now();
  this.dirX = 1;
  this.dirY = 1;
  this.x = 0;
  this.y = 0;
  this.speedY = DEFAULT_SPEED;
  this.speedX = DEFAULT_SPEED;
};

module.exports = Ball;

