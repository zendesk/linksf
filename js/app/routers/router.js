var $ = require('jquery'),
    Backbone = require('backbone'),
    AppView = require('views/app_view'),
    AdminView = require('views/admin_view'),
    DetailView = require('views/detail_view'),
    ListView = require('views/list_view'),
    Facilities = require('collections/facilities');

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
    var json = $('#results').data('results'),
        facilities = new Facilities(json);

    console.log('entering list route');

    var listView = new ListView({ collection: facilities });
    listView.render();
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
