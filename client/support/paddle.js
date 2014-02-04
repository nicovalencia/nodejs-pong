var
  _ = require('underscore'),
  THREE = require('THREE');

function Paddle(opts) {

  _.extend(this, _.pick(opts, 'id', 'game'));

  this.material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
  });
  this.geometry = new THREE.CubeGeometry(1, 1, 1);
  this.object = new THREE.Mesh(this.geometry, this.material);

  this.resize();
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

Paddle.prototype.getX = function() {
  var multiplier = (this.id === 1) ? -1 : 1;
  return (multiplier * this.game.board.getWidth() / 2) + (multiplier * this.getWidth() / 2);
};

Paddle.prototype.move = function(data) {
  this.object.position.y = (this.game.board.getHeight() / 2) * data.y / 100;
};

Paddle.prototype.resize = function() {
  this.object.scale.x = this.getWidth();
  this.object.scale.y = this.getHeight();
  this.object.scale.z = this.getDepth();
  this.object.position.x = this.getX();
  this.object.position.z = this.getDepth() / 2;
};

module.exports = Paddle;

