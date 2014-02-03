var
  THREE = require('THREE');

function Board() {

  var texture = new THREE.ImageUtils.loadTexture('/images/boards/zelda.png');

  this.geometry = new THREE.PlaneGeometry(1, 1);
  this.material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.9
  });
  this.object = new THREE.Mesh(this.geometry, this.material);

  this.object.receiveShadow = true;
  this.resize();
}

Board.prototype.getWidth = function() {
  return window.innerWidth * (2/3) * 0.95;
};

Board.prototype.getHeight = function() {
  return window.innerWidth * (1/3);
};

Board.prototype.resize = function() {
  this.object.scale.x = this.getWidth();
  this.object.scale.y = this.getHeight();
};

module.exports = Board;

