var
  _ = require('underscore'),
  THREE = require('THREE');

function SkyBox(opts) {

  _.extend(this, _.pick(opts, 'game'));

  this.geometry = new THREE.CubeGeometry(5000, 5000, 5000);
  this.object = new THREE.Mesh(this.geometry);

  // Load default texture:
  this.loadTexture('nyan');

  this.resize();
}

SkyBox.prototype.loadTexture = function(texture) {

  // Build materials array:
  var materials = [];
  var path = '/images/skybox/' + texture + '/';
  var directions = ['xpos', 'xneg', 'ypos', 'yneg', 'zpos', 'zneg'];
  var ext = '.png';

  for (var i=0; i<6; i++) {
    materials.push(new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture(path + directions[i] + ext),
      side: THREE.BackSide
    }));
  }

  this.object.material = new THREE.MeshFaceMaterial(materials);
};

SkyBox.prototype.resize = function() {
  this.object.rotation.z = -90 * Math.PI/180;
  this.object.rotation.y = -90 * Math.PI/180;
};

module.exports = SkyBox;

