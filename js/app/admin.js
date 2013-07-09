var $     = require('jquery');

require('jquery-serialize-object');

$(function() {
  var Parse = require('parse');
  Parse.initialize("Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8", "kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls");

  // provision the router instance
  var router = require('routers/admin_router').instance;

  // begin tracking hashChange
  require('backbone').history.start();
});
