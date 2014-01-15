window.FastClick(document.body);
var Handlebars = require('handlebars-runtime');

Handlebars.registerPartial('filterCategories',    require('shared/templates/_filter_categories'));
Handlebars.registerPartial('openHours',           require('shared/templates/_open_hours'));
Handlebars.registerPartial('queryRepresentation', require('templates/_query_representation'));

$(function() {
  require('lib/boot');
  Parse.initialize(parseAppId, parseJSKey);

  require('routers/router').instance();
  Backbone.history.start();
});
