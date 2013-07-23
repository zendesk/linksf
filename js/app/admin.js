var $          = require('jquery'),
    Handlebars = require('handlebars-runtime');

require('jquery-serialize-object');
Handlebars.registerPartial("editService", require('templates/edit_service'));

$(function() {
  var Parse = require('parse');
  Parse.initialize("Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8", "kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls");

  // provision the router instance
  var router = require('routers/admin_router').instance;

  // begin tracking hashChange
  require('backbone').history.start();
});
