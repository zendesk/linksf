var $ = require('jquery');

require('jquery-serialize-object');

$(function() {
  var AppView  = require('views/app_view'),
      Router   = require('routers/router'),
      appView;

  Parse.initialize("Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8", "kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls");

  new Router();

  appView = new AppView();
  appView.render();
  // execute default query
  appView.onSubmit();

  require('backbone').history.start();
});
