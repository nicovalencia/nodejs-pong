var
  util = require('lib/util'),
  _ = require('underscore'),
  THREE = require('THREE');

function Camera(opts) {

  // Flag when an animation is occuring:
  this.isMoving = false;

  // Initialize animation move vector:
  this.moveTo = {};

  _.extend(this, _.pick(opts, 'game'));

  this.object = new THREE.PerspectiveCamera(80, util.getAspectRatio(), 0.1, 10000);

  // Setup:
  this.player = null;
  this.object.position.z = this.game.board.getHeight();
  this.object.position.y = 0;
}

Camera.prototype.update = function(delta) {

  var diff = 0;

  if (this.side * this.object.position.x < this.side * this.moveTo.positionX) {
    this.object.position.x += this.side * this.speed * delta;
    diff++;
  }

  if (this.side * this.object.rotation.y < this.side * this.moveTo.rotationY) {
    this.object.rotation.y += this.side * this.speed / 500 * delta;
    diff++;
  }

  if (this.side * this.object.rotation.z < this.side * this.moveTo.rotationZ) {
    this.object.rotation.z += this.side * this.speed / 500 * delta;
    diff++;
  }

  // When we are done moving stuff:
  if (diff === 0) {

    // Unset animation flag:
    this.isMoving = false;

    // Snap to final locations:
    this.object.position.x = this.moveTo.positionX;
    this.object.rotation.y = this.moveTo.rotationY;
    this.object.rotation.z = this.moveTo.rotationZ;
  }

};

Camera.prototype.setPlayer = function(player) {

  // Prevent duplicate animations:
  if (this.isMoving) {
    return false;
  }

  // Set player id:
  this.player = player;

  // Set side:
  this.side = (this.player === 1) ? -1 : 1;

  // Set animation flag:
  this.isMoving = true;

  // Set initial speed:
  this.speed = window.innerWidth * 0.6;

  // Set position targets:
  this.moveTo.positionX = this.side * this.game.board.getWidth() * 1.2;
  this.moveTo.rotationY = this.side * 90 * Math.PI/180;
  this.moveTo.rotationZ = this.side * 90 * Math.PI/180;

};

Camera.prototype.resize = function() {

  // Only resize once a player has been chosen:
  if (this.player === null) {
    return false;
  }

  this.object.position.x = this.side * window.innerWidth * 1;
  this.object.position.z = window.innerWidth * 0.5;
};

module.exports = Camera;

