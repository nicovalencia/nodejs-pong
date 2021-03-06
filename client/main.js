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
  this.socket = io.connect(window.location.protocol + '//' + window.location.host);
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

  this.socket.on('update', function(data) {
    _this.player.move(data.player1);
    _this.opponent.move(data.player2);
    _this.ball.move(data.ball);
  });

  this.socket.on('ballReset', function(data) {
    renderCountdown(data.timeout);
  });

  this.socket.on('playerMiss', function(data) {
    renderHearts('player1', data.lives.player1);
    renderHearts('player2', data.lives.player2);

    bounceHeart(data.playerId);
  });

  this.socket.on('over', function(data) {
    var winner = (data.lives.player1 === 0) ? 'player2' : 'player1';
    var $winnerHearts = $('aside#'+winner);
    
    // Animate winner's hearts:
    // todo: make this code go away...
    $winnerHearts.addClass('animated shake');
    setTimeout(function() { $winnerHearts.removeClass('animated shake'); }, 1000);
    setTimeout(function() { $winnerHearts.addClass('animated bounce'); }, 1100);
    setTimeout(function() { $winnerHearts.removeClass('animated bounce'); }, 2100);
    setTimeout(function() { $winnerHearts.addClass('animated swing'); }, 3200);
    setTimeout(function() { $winnerHearts.removeClass('animated swing'); }, 4200);
    setTimeout(function() { $winnerHearts.addClass('animated pulse'); }, 5300);
    setTimeout(function() { $winnerHearts.removeClass('animated pulse'); }, 6300);

    // Reload lives:
    setTimeout(function() {
      renderHearts('player1', 3);
      renderHearts('player2', 3);
    }, 7000);
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

function bounceHeart(playerId) {
  var $hearts = $('aside#player'+playerId);
  $hearts.addClass('animated bounce');

  // Trigger animation on next tick:
  setTimeout(function() {
    $hearts.removeClass('animated bounce');
  }, 2000);
}

function renderHearts(player, lives) {
  var $hearts = $('<div/>');
  for (var i=0; i<lives; i++) {
    $hearts.append('<span></span>');
  }
  $('aside#'+player).html($hearts);
}

function renderCountdown(timeout) {

  var seconds = ~~(timeout / 1000);

  window.game.notifier.show(seconds);

  for (var i=seconds-1; i>0; i--) {
    setTimeout((function(i) {
      return function() {
        window.game.notifier.show(i);
      }
    })(i), (seconds - i) * 1000);
  }

  setTimeout(function() {
    window.game.notifier.show('GO!');
  }, seconds * 1000);

}

module.exports = window.game;

