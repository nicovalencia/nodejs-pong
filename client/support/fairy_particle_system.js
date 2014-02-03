var
  _ = require('underscore'),
  THREE = require('THREE');

function FairyParticleSystem(opts) {

  _.extend(this, _.pick(opts, 'game'));

  this.particles = new THREE.Geometry();
  this.colors = [];

  // Construct particles:
  var particle;
  for (var i = 0; i < 100; i++) {
    particle = new THREE.Vector3();
    this.particles.vertices.push(particle);
    this.colors[i] = new THREE.Color(0xffffff);
    this.colors[i].setHSL( Math.random() * 0.25 + 0.2, Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5 );
  }

  // Apply color array to vector array:
  this.particles.colors = this.colors;

  this.texture = THREE.ImageUtils.loadTexture('/images/particles/fairy.png');
  this.material = new THREE.ParticleBasicMaterial({
    color: 0xeeeeee,
    map: this.texture,
    vertexColors: true,
    transparent: true,
    size: 15
  });

  this.object = new THREE.ParticleSystem(this.particles, this.material);

  // Setup:
  this.particles.dynamic = true;
  this.object.sortParticles = true;

  this.resize();
}

FairyParticleSystem.prototype.setDefaultVectorPosition = function(particle) {
  var width = this.game.board.getWidth();
  var height = this.game.board.getHeight();
  var xBound = width;
  var yBound = height * 3;
  var xOffset = - width / 2;
  var yOffset = - height * 1.5;

  particle.x = Math.random() * xBound + xOffset;
  particle.y = Math.random() * yBound + yOffset;
  particle.z = Math.random() * window.innerHeight;
};

FairyParticleSystem.prototype.resetVectors = function() {
  var len = this.particles.vertices.length;
  for (var i=0; i < len; i++) {
    this.setDefaultVectorPosition(this.particles.vertices[i]);
  }
};

FairyParticleSystem.prototype.moveParticle = function(particle, speed, offset) {
  particle.z += offset * speed;

  // Reset particles that hit the roof:
  if (particle.z > window.innerHeight) {
    this.setDefaultVectorPosition(particle);
  }
};

FairyParticleSystem.prototype.update = function(delta) {

  // Rotate system:
  this.object.rotation.z -= delta / 10;

  // Move each particle:
  var len = this.particles.vertices.length;
  var offset = delta * window.innerHeight / 50;
  for (var i=0; i < len; i++) {
    this.moveParticle(this.particles.vertices[i], (3*i/len), offset);
  }

  // Flag object geometry for rendering update:
  this.object.geometry.verticesNeedUpdate = true;
};

FairyParticleSystem.prototype.getParticleSize = function() {
  return window.innerHeight / 60;
};

FairyParticleSystem.prototype.resize = function() {
  this.resetVectors();
  this.object.material.size = this.getParticleSize();
};

module.exports = FairyParticleSystem;

