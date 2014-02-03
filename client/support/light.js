var
  _ = require('underscore'),
  THREE = require('THREE');

function Light(opts) {

  _.extend(this, _.pick(opts, 'id', 'game'));

  this.object = new THREE.PointLight(0xffffff);

  // Set defaults:
  this.object.position.y = 0;
  this.object.position.z = 100;
  this.object.intensity = 0.8;

  this.resize();
}

Light.prototype.getX = function() {
  var multiplier = (this.id === 1) ? -1 : 1;
  return (multiplier * this.game.board.getWidth() / 2)
};

Light.prototype.resize = function() {
  this.object.position.x = this.getX();
};

module.exports = Light;

