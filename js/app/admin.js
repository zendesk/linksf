/* global parseAppKey, parseJSKey */
var $          = require('jquery'),
    Handlebars = require('handlebars-runtime');

require('jquery-serialize-object');
Handlebars.registerPartial("editService", require('templates/_edit_service'));
Handlebars.registerPartial("editServiceHours", require('templates/_edit_service_hours'));
Handlebars.registerPartial("openHours", require('templates/_open_hours'));
Handlebars.registerPartial("filterCategories", require('templates/_filter_categories'));

$(function() {
  var Parse = require('parse');
  Parse.initialize(parseAppKey, parseJSKey);

  // provision the router instance
  var router = require('routers/admin_router').instance;

  // begin tracking hashChange
  require('backbone').history.start();
});
