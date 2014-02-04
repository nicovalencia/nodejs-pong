'use strict';

const
  _ = require('underscore');

function Paddle() {
  this.y = 0;

  _.bindAll(this, 'move');
}

Paddle.prototype.move = function(data) {
  this.y += data.dy;

  if (this.y > 80) {
    this.y = 80;
  } else if (this.y < -80) {
    this.y = -80;
  }
};

module.exports = Paddle;

