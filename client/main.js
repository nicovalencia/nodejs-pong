var
  _ = require('underscore'),
  THREE = require('THREE');

var
  config = require('lib/config'),
  util = require('lib/util');

var
  Notifier = require('support/notifier'),
  Camera = require('support/camera'),
  Board = require('support/board'),
  Ball = require('support/ball'),
  Paddle = require('support/paddle'),
  Light = require('support/light'),
  SkyBox = require('support/sky_box'),
  FairyParticleSystem = require('support/fairy_particle_system');

function Game() {
  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  this.clock = new THREE.Clock;
  this.canvas = document.getElementById('canvas');
  this.canvas.appendChild(this.renderer.domElement);
  this.scene = new THREE.Scene();

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

  this.skyBox = new SkyBox({ game: this });
  this.scene.add(this.skyBox.object);

  this.fairyParticleSystem = new FairyParticleSystem({ game: this });
  this.scene.add(this.fairyParticleSystem.object);

  // Setup notifications:
  this.notifier = new Notifier();

  // Setup camera:
  this.camera = new Camera({ game: this });

  // Bind window resizing, and set defaults:
  $(window).on('resize', _.bind(this.resize, this));
  this.resize();

  // Bind socket events:
  this.socket = io.connect('http://localhost');
  this.bindSocketEvents();

  // Bind player events:
  this.bindPlayerEvents();

  // Begin draw loop:
  this.draw();
}

Game.prototype.draw = function() {

  var delta = this.clock.getDelta();

  // If camera is moving, continue animation:
  if (this.camera.isMoving) {
    this.camera.update(delta);
  }

  // Animate particle system:
  this.fairyParticleSystem.update(delta);

  // Render scene:
  this.renderer.render(this.scene, this.camera.object);

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
  this.skyBox.resize();
  this.fairyParticleSystem.resize();
  this.camera.resize();

  // Set renderer size:
  this.renderer.setSize(window.innerWidth, window.innerHeight);
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

  this.socket.on('playerMiss', function(data) {
    renderCountdown();
    renderHearts('player1', data.lives.player1);
    renderHearts('player2', data.lives.player2);
  });

  this.socket.on('over', function(data) {
    var winner = (data.lives.player1 === 0) ? 'Player 2' : 'Player 1';
    var msg = winner + ' Wins!';

    // Reload lives:
    renderHearts('player1', 3);
    renderHearts('player2', 3);

    _this.notifier.show(msg);
  });
};

Game.prototype.bindPlayerEvents = function() {

  var _this = this;

  $('nav').on('click', 'a[data-player]', function(e) {
    e.preventDefault();
    var playerId = $(e.currentTarget).data('player');
    _this.camera.setPlayer(playerId);
  });

  $('nav form#skybox').on('change', 'select', function(e) {
    var texture = $(e.currentTarget).val();
    _this.skyBox.loadTexture(texture);
  });

  $('nav form#board').on('change', 'select', function(e) {
    var texture = $(e.currentTarget).val();
    _this.board.loadTexture(texture);
  });

};

$(document).ready(function() {
  window.game = new Game();
});

// Private helpers:

function renderHearts(player, lives) {
  var $hearts = $('<div/>');
  for (var i=0; i<lives; i++) {
    $hearts.append('<span></span>');
  }
  $('aside#'+player).html($hearts);
}

function renderCountdown() {
  window.game.notifier.show('3');
  setTimeout(function() {
    window.game.notifier.show('2');
    setTimeout(function() {
      window.game.notifier.show('1');
      setTimeout(function() {
        window.game.notifier.show('GO!');
      }, 1000);
    }, 1000);
  }, 1000);
}

module.exports = window.game;

