var
  _ = require('underscore'),
  config = require('lib/config'),
  THREE = require('THREE');

function Paddle(opts) {

  _.extend(this, _.pick(opts, 'id', 'game'));

  this.material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5
  });

  this.geometry = new THREE.CubeGeometry(
    0,
    0,
    0,
    config.quality,
    config.quality,
    config.quality
  );

  this.mesh = new THREE.Mesh(this.geometry, this.material);
}

Paddle.prototype.getWidth = function() {
  return this.game.board.getWidth() * 0.01;
};

Paddle.prototype.getHeight = function() {
  return this.game.board.getHeight() * 0.2;
};

Paddle.prototype.getDepth = function() {
  return this.game.board.getWidth() * 0.02;
};

Paddle.prototype.resize = function() {
  this.geometry.width = this.getWidth();
  this.geometry.height = this.getHeight();
  this.geometry.depth = this.getDepth();
  this.mesh.position.x = (-this.game.board.getWidth() / 2) + this.getWidth();
  this.mesh.position.z = this.getDepth();
};

module.exports = Paddle;

