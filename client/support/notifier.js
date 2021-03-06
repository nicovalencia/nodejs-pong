var ANIMATION_CLASS = 'animated slideOutUp';

function Notifier() {
  this.$notification = false;
}

Notifier.prototype.show = function(msg) {
  // Animate old notifications out:
  if (this.$notification) {
    this.$notification.addClass(ANIMATION_CLASS);
  }

  this.$notification = $('<p/>', {
    class: 'notification',
    text: msg
  });

  $('body').append(this.$notification);

  // Remove notification later:
  var $cachedEl = $(this.$notification);
  setTimeout(function() {
    $cachedEl.addClass(ANIMATION_CLASS);
    $cachedEl.remove();
    $cachedEl = false;
  }, 1500);
};

module.exports = Notifier;

