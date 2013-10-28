var Handlebars = require('handlebars-runtime');

Handlebars.registerPartial('filterCategories',    require('shared/templates/_filter_categories'));
Handlebars.registerPartial('queryRepresentation', require('templates/_query_representation'));
Handlebars.registerPartial('nav',                 require('templates/_nav'));

$(function() {
  window.FastClick(document.body);

  Parse.initialize(
    'Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8',
    'kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls'
  );

  require('routers/router').instance();
  Backbone.history.start();
});
