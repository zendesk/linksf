//Register partials
Handlebars.registerPartial('filterCategories',    require('templates/_filter_categories'));
Handlebars.registerPartial('editService',         require('templates/_edit_service'));
Handlebars.registerPartial('openHours',           require('templates/_open_hours'));
Handlebars.registerPartial('nav',                 require('templates/_nav'));
Handlebars.registerPartial('queryRepresentation', require('templates/_query_representation'));

$(function() {
  window.FastClick(document.body);
  Parse.initialize('Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8', 'kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls');
  require('routers/router').instance;
  Backbone.history.start();
});
