'use strict';

const
  zmq = require('zmq'),
  util = require('util'),
  events = require('events');

function ZmqEmitter(address) {

  let _this = this;

  this.subscriber = zmq.socket('sub');

  // Subscribe to all ZMQ messages:
  this.subscriber.subscribe('');

  // When a message is received, emit the data:
  this.subscriber.on('message', function(data) {
    let
      speed = 5,
      msg = JSON.parse(data.toString());
      eventMsg = (msg.nunchuck === 1) ? 'player1Move' : 'player2Move',
      multiplier = (msg.nunchuck === 1) ? -1 : 1,
      dy = multiplier * msg.x * speed;

    _this.emit(eventMsg, { dy: dy });
  });

  this.subscriber.connect(address);
}

// ZmqEmitter will emit events for:
// - player1Move, { dy: Float }
// - player2Move, { dy: Float }
util.inherits(ZmqEmitter, events.EventEmitter);

module.exports = ZmqEmitter;

