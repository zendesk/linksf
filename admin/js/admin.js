var Handlebars = require('hbsfy/runtime');

Handlebars.registerPartial('editService',      require('./templates/_edit_service.hbs'));
Handlebars.registerPartial('editServiceHours', require('./templates/_edit_service_hours.hbs'));
Handlebars.registerPartial('filterCategories', require('../../shared/js/templates/_filter_categories.hbs'));
Handlebars.registerPartial('openHours', require('../../shared/js/templates/_open_hours.hbs'));

$(function() {
  Parse.initialize(config.parseAppId, config.parseJsKey);
  require('./routers/router').instance();
  Backbone.history.start();
});
