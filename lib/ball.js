'use strict';

const
  util = require('util'),
  events = require('events'),
  MINIMUM_SPEED = 0.1,
  MAXIMUM_SPEED = 0.3,
  DEFAULT_SPEED = 0.1;

function Ball() {
  // Flag when ball times out after a reset:
  this.timeout = false;

  this.reset();
}

// Ball will emit events for:
// - player1WallCollision
// - player2WallCollision
util.inherits(Ball, events.EventEmitter);

Ball.prototype.updateSpeed = function(paddle) {
  let multiplier = this.y - paddle.y;

  this.dirY = multiplier * 0.1;

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
    this.emit('player2WallCollision');
  } else if (this.x < -100) {
    this.x = -100;
    this.emit('player1WallCollision');
  }
};

Ball.prototype.getDelta = function() {
  let time = Date.now();
  let delta = time - this.ts;

  this.ts = time;

  return delta;
};

Ball.prototype.updatePosition = function() {
  if (this.timeout) {
    return false;
  }

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
  let _this = this;

  this.ts = Date.now();
  this.dirX = 1;
  this.dirY = (Math.random() * 2) - 1;
  this.x = 0;
  this.y = 0;
  this.speedY = DEFAULT_SPEED;
  this.speedX = DEFAULT_SPEED;

  // Wait 3 seconds before continuing ball movement:
  this.timeout = true;
  setTimeout(function() {
    _this.ts = Date.now();
    _this.timeout = false;
  }, 3000);
};

module.exports = Ball;

