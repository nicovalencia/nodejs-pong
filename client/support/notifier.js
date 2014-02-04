function Notifier() {
  this.$notification = false;
}

Notifier.prototype.show = function(msg) {
  // Animate old notifications out:
  if (this.$notification) {
    this.$notification.addClass('animated bounceOutLeft');
  }

  this.$notification = $('<p/>', {
    class: 'notification',
    text: msg
  });

  $('body').append(this.$notification);

  // Remove notification later:
  var $cachedEl = $(this.$notification);
  setTimeout(function() {
    $cachedEl.addClass('animated bounceOutLeft');
    $cachedEl.remove();
    $cachedEl = false;
  }, 1500);
};

module.exports = Notifier;

