var $ = require('jquery');

require('jquery-serialize-object');

$(function() {
  Parse.initialize("Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8", "kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls");

  // provision the router instance
  var router = require('routers/router').instance;

  router.listViewClass = require('views/admin_list_view');

  // begin tracking hashChange
  require('backbone').history.start();

  // navigate to root route
  // router.navigate('');
});
