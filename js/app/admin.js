var $ = require('jquery');

$(function() {
  var AdminView = require('./views/admin_view.js'),
      adminView = new AdminView();

  adminView.render();
});
