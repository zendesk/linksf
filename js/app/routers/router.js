var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    QueryView = require('views/query_view'),
    AdminView = require('views/admin_view'),
    DetailView = require('views/detail_view'),
    ListView = require('views/list_view'),
//    Facilities = require('collections/facilities');
// Sort this out:
    Facilities = require('collections/facilities');

var Router = Backbone.Router.extend({
  routes: {
    '': 'query',
    'list': 'list',
    'admin': 'admin',
    'detail/:id': 'detail'
  },

  facilities: new Facilities(),

  query: function() {
    console.log('entering query route');

    var queryView = new QueryView();
    queryView.render();
  },

  list: function() {

    var json = $('#results').data('results');
    this.facilities.reset(json);

    console.log('entering list route:', this.facilities);

    var listView = new ListView({ collection: this.facilities });
    listView.render();
  },

  detail: function(id) {
    //we need to write an event func in listview that passes the object on click. this var setting here is TEMPORARY:
    //var facility = this.facilities.get(id);
    //var facility = this.facilities.models[0].toJSON();
    var facility = $('#results').data('results').models[0].toJSON();

    //Fetch Facility from backend if not in collection

    console.log('entering details route:', facility );

    var detailView = new DetailView({ model: facility });
    detailView.render();
  },

  admin: function() {
    console.log('entering admin route');

    var adminView = new AdminView();
    adminView.render();
  }
});

var instance;

Router.getInstance = function() {
  instance = instance || new Router();
  return instance;
};

module.exports = Router;
