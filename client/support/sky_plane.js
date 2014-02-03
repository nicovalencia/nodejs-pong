var
  _ = require('underscore'),
  THREE = require('THREE');

function SkyPlane(opts) {

  _.extend(this, _.pick(opts, 'game'));

  this.texture = new THREE.ImageUtils.loadTexture('/images/backgrounds/hyrule.jpg');

  this.material = new THREE.MeshBasicMaterial({ map: this.texture });
  this.geometry = new THREE.PlaneGeometry(1, 1);
  this.object = new THREE.Mesh(this.geometry, this.material);

  // Setup:
  this.object.rotation.z = -90 * Math.PI/180;
  this.object.rotation.y = -90 * Math.PI/180;

  this.resize();
}

SkyPlane.prototype.getWidth = function() {
  return window.innerWidth * 2.6;
};

SkyPlane.prototype.getHeight = function() {
  return window.innerHeight * 2.6;
};

SkyPlane.prototype.getX = function() {
  return this.game.board.getWidth() / 2;
};

SkyPlane.prototype.getZ = function() {
  return this.game.board.getWidth() / 2;
};

SkyPlane.prototype.resize = function() {
  this.object.scale.x = this.getWidth();
  this.object.scale.y = this.getHeight();
  this.object.position.x = this.getX();
  this.object.position.z = this.getZ();
};

module.exports = SkyPlane;

