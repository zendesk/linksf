var $ = require('jquery'),
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

  query: function() {
    console.log('entering query route');

    var queryView = new QueryView();
    queryView.render();
  },

  list: function() {
    var json = $('#results').data('results'),
      facilities = new Facilities(json);

    console.log('entering list route:', facilities);

    var listView = new ListView({ collection: facilities });
    listView.render();
  },

  detail: function(id) {
    //we need to write an event func in listview that passes the object on click. this var setting here is TEMPORARY:  
    var facility = $('#results').data('results').models[0].toJSON();


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

module.exports = Router;
