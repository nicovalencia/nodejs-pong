'use strict';

const
  util = require('util'),
  events = require('events');

function TestEmitter(game) {

  let _this = this;

  this.direction = -1,
  this.speed = 1;

  // Emit movements:
  setInterval(function() {
    for (let player in game.paddles) {
      _this.emit(player+'Move', { dy: _this.direction * _this.speed });
    }
  }, 1);

  // Randomly change direction:
  setInterval(function() {
    _this.direction = Math.random() * 2 - 1;
  }, 500);

}

// TestEmitter will emit events for:
// - player1Move, { dy: Float }
// - player2Move, { dy: Float }
util.inherits(TestEmitter, events.EventEmitter);

module.exports = TestEmitter;

