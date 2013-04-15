var $ = require('jquery');

require('jquery-serialize-object');

$(function() {
  var App = {},
      Router = require('routers/router');

  Parse.initialize("Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8", "kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls");

  // add to global namespace since we need to access router
  App.Router = new Router();

  // begin tracking hashChange
  require('backbone').history.start();

  // navigate to root route
  App.Router.navigate('');
});
