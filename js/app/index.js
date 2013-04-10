var $ = require('jquery');

require('jquery-serialize-object');

$(function() {
  var Backbone = require('backbone'),
      AppView  = require('views/app_view'),
      appView  = new AppView(),
      Router   = require('routers/router'),
      router   = new Router();

  Parse.initialize("Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8", "kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls");

  appView.render();

  Backbone.history.start();
});
