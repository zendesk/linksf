var $ = require('jquery');

require('jquery-serialize-object');

$(function() {
  var App = {},
      router = require('routers/router').getInstance();

  Parse.initialize("Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8", "kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls");


  // begin tracking hashChange
  require('backbone').history.start();

  // navigate to root route
  router.navigate('');
});
