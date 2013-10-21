require('../../build/vendor.js');

//Register partials
Handlebars.registerPartial("filterCategories", require('./templates/_filter_categories.hbs'));
Handlebars.registerPartial("editService", require('./templates/_edit_service.hbs'));
Handlebars.registerPartial("openHours", require('./templates/_open_hours.hbs'));
Handlebars.registerPartial("nav", require('./templates/_nav.hbs'));
Handlebars.registerPartial("queryRepresentation", require('./templates/_query_representation.hbs'));

$(function() {
  Fastclick(document.body);
  Parse.initialize("Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8", "kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls");
  require('./routers/router.js').instance;
  Backbone.history.start();
});
