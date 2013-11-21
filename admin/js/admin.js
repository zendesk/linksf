var Handlebars = require('handlebars-runtime');

Handlebars.registerPartial('editService',      require('templates/_edit_service'));
Handlebars.registerPartial('editServiceHours', require('templates/_edit_service_hours'));
Handlebars.registerPartial('filterCategories', require('shared/templates/_filter_categories'));
Handlebars.registerPartial('openHours', require('shared/templates/_open_hours'));

$(function() {
  Parse.initialize(parseAppKey, parseJSKey);

  require('routers/router').instance();
  Backbone.history.start();
});
