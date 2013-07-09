var $          = require('jquery'),
    Parse      = require('parse'),
    Handlebars = require('handlebars-runtime');

require('jquery-serialize-object');
require('bootstrap');

//Register partials
Handlebars.registerPartial("filterCategories", require('templates/filter_categories'));
Handlebars.registerPartial("editService", require('templates/edit_service'));

$(function() {
  Parse.initialize("Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8", "kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls");

  // provision the router instance
  var router = require('routers/router').instance;

  // begin tracking hashChange
  require('backbone').history.start();

  
});
