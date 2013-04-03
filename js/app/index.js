var $ = require('jquery');

$(function() {
 var Parse    = require('parse'),
     Backbone = require('backbone');

  Parse.initialize("Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8", "kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls");

  var AppView = Backbone.View.extend({
    el: $("#linksf")
  });

  var App = new AppView();
});
