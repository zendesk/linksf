var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    QueryView = require('views/query_view'),
    AdminView = require('views/admin_view'),
    DetailView = require('views/detail_view'),
    ListView = require('views/list_view'),
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

    //var facility = this.facilities.get(id);
    //var facility = this.facilities.models[0].toJSON();
    //var facility = $('#results').data('results').models[0].toJSON()

//we need to write an event func in listview that passes the object on click. this var setting here is TEMPORARY:
    var facility = JSON.parse('{"address":"225 30th Street","description":"Women thing","gender":"F","name":"30TH STREET SENIOR CENTER","notes":"foobar","phone":"(415) 550-2210","age":["S"],"hours":{"Sun": "11-12"},"location":{"__type":"GeoPoint","latitude":37.7421083,"longitude":-122.4251428},"services":["technology"],"objectId":"20ivH0qnQE","createdAt":"2013-04-09T07:01:45.280Z","updatedAt":"2013-04-09T14:55:19.177Z"}');
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