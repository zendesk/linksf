var $ = require('jquery');

$(function() {
  var AdminView = require('views/admin_view'),
      adminView = new AdminView();

  adminView.render();
});
