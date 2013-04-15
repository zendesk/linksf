var $ = require('jquery');

require('jquery-serialize-object');

$(function() {
  var AppView  = require('views/app_view'),
      Router   = require('routers/router'),
      appView, router;

  Parse.initialize("Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8", "kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls");

  new Router();

  appView.render();

  require('backbone').history.start();
});
