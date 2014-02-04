var
  THREE = require('THREE');

function Board() {

  this.geometry = new THREE.PlaneGeometry(1, 1);
  this.object = new THREE.Mesh(this.geometry);

  // Setup
  this.loadTexture('nyan');
  this.object.receiveShadow = true;

  this.resize();
}

Board.prototype.loadTexture = function(texture) {
  var path = '/images/boards/' + texture + '.png';

  this.object.material = new THREE.MeshBasicMaterial({
    map: new THREE.ImageUtils.loadTexture(path),
    transparent: true,
    opacity: 0.9
  });
};

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

