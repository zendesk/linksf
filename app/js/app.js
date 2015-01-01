require('lib/shim_bind');
var Handlebars = require('handlebars-runtime');

Handlebars.registerPartial('filterCategories',    require('shared/templates/_filter_categories'));
Handlebars.registerPartial('openHours',           require('shared/templates/_open_hours'));
Handlebars.registerPartial('queryRepresentation', require('templates/_query_representation'));

if ( typeof ga === 'undefined' ) {
  window.ga = function(){};
}

$(function() {
  window.FastClick.attach(document.body);
  require('lib/boot');
  Parse.serverURL = 'http://api.link-sf.com';
  Parse.initialize(config.parseAppId, config.parseJsKey);
  require('routers/router').instance();
  Backbone.history.start();
});
