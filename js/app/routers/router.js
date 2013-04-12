var Backbone = require('backbone'),
    AppView = require('views/app_view'),
    AdminView = require('views/admin_view'),
    DetailView = require('views/detail_view');

var Router = Backbone.Router.extend({
  routes: {
    '': 'query',
    'list': 'list',
    'admin': 'admin',
    'detail': 'detail'
  },

  query: function() {
    console.log('entering query route');

    var appView = new AppView();
    appView.render();
  },

  list: function() {
    // anything can happen!
  },

  admin: function() {
    console.log('entering admin route');

    var adminView = new AdminView();
    adminView.render();
  },
  detail: function() {
    var detailView = new DetailView();
    detailView.render();
  }
});

module.exports = Router;
