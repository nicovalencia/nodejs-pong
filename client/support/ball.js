var
  _ = require('underscore'),
  THREE = require('THREE');

function Ball(opts) {

  _.extend(this, _.pick(opts, 'game'));

  this.material = new THREE.MeshLambertMaterial({
    color: 0xffffff
  });
  this.geometry = new THREE.SphereGeometry(1, 6, 10);
  this.object = new THREE.Mesh(this.geometry, this.material);

  this.resize();
}

Ball.prototype.getRadius = function() {
  return this.game.board.getHeight() * 0.03;
};

Ball.prototype.move = function(data) {
  this.object.position.y = (this.game.board.getHeight() / 2) * data.y / 100;
  this.object.position.x = (this.game.board.getWidth() / 2) * data.x / 100;
};

Ball.prototype.resize = function() {
  this.object.scale.x = this.getRadius();
  this.object.scale.y = this.getRadius();
  this.object.scale.z = this.getRadius();
  this.object.position.z = this.getRadius();
};

module.exports = Ball;

