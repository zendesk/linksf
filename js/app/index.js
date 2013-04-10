var $ = require('jquery');

require('jquery-serialize-object');

$(function() {
 var AppView  = require('views/app_view'),
     appView  = new AppView();

  Parse.initialize("Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8", "kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls");

  appView.render();
});
