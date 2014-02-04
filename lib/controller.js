'use strict';

const
  ZmqEmitter = require('./zmq_emitter'),
  TestEmitter = require('./test_emitter');

function Controller(type, opts) {

  if (type === 'zmq') {
    this.emitter = new ZmqEmitter(opts.address);
  } else if (type === 'test') {
    this.emitter = new TestEmitter(opts.game);
  }

}

module.exports = Controller;

