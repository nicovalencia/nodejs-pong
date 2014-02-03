var
  _ = require('underscore'),
  THREE = require('THREE');

var
  config = require('lib/config'),
  util = require('lib/util');

var
  Board = require('support/board'),
  Ball = require('support/ball'),
  Paddle = require('support/paddle'),
  Light = require('support/light'),
  SkyPlane = require('support/sky_plane'),
  FairyParticleSystem = require('support/fairy_particle_system');

function Game() {
  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  this.clock = new THREE.Clock;
  this.canvas = document.getElementById('canvas');
  this.canvas.appendChild(this.renderer.domElement);
  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(80, util.getAspectRatio(), 0.1, 10000);

  this.board = new Board();
  this.scene.add(this.board.object);

  this.ball = new Ball({ game: this });
  this.scene.add(this.ball.object);

  this.player = new Paddle({ id: 1, game: this });
  this.scene.add(this.player.object);

  this.opponent = new Paddle({ id: 2, game: this });
  this.scene.add(this.opponent.object);

  this.playerLight = new Light({ id: 1, game: this });
  this.scene.add(this.playerLight.object);

  this.opponentLight = new Light({ id: 2, game: this });
  this.scene.add(this.opponentLight.object);

  this.skyPlane = new SkyPlane({ game: this });
  this.scene.add(this.skyPlane.object);

  this.fairyParticleSystem = new FairyParticleSystem({ game: this });
  this.scene.add(this.fairyParticleSystem.object);

  // Bind window resizing, and set defaults:
  $(window).on('resize', _.bind(this.resize, this));
  this.resize();

  // Bind socket events:
  this.socket = io.connect('http://localhost');
  this.bindSocketEvents();

  // Begin draw loop:
  this.draw();
}

Game.prototype.draw = function() {

  var delta = this.clock.getDelta();

  // Animate particle system:
  this.fairyParticleSystem.update(delta);

  // Render scene:
  this.renderer.render(this.scene, this.camera);

  // Queue next loop with RAF:
  var _this = this;
  requestAnimationFrame(function () {
    _this.draw();
  });
};

Game.prototype.resize = function() {
  this.board.resize();
  this.ball.resize();
  this.player.resize();
  this.opponent.resize();
  this.playerLight.resize();
  this.opponentLight.resize();
  this.skyPlane.resize();
  this.fairyParticleSystem.resize();

  // Set renderer size:
  this.renderer.setSize(window.innerWidth, window.innerHeight);

  // Position camera behind player:
  this.camera.position.z = this.board.getHeight() * 0.9;
  this.camera.position.x = this.player.object.position.x - this.board.getWidth() * 0.7;
  this.camera.position.y = 0;
  this.camera.rotation.z = -90 * Math.PI/180;
  this.camera.rotation.y = -90 * Math.PI/180;
};

Game.prototype.bindSocketEvents = function() {
  var _this = this;

  this.socket.on('player', function(data) {
    _this.player.move(data);
  });

  this.socket.on('opponent', function(data) {
    _this.opponent.move(data);
  });

  this.socket.on('ball', function(data) {
    _this.ball.move(data);
  });
};

$(document).ready(function() {
  window.game = new Game();
});

module.exports = window.game;

