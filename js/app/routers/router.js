var $ = require('jquery'),
    Backbone = require('backbone'),
    DetailView = require('views/detail_view'),
    ListView = require('views/list_view'),
    Query = require('lib/query'),
    facilities = require('collections/facilities').instance;

var Router = Backbone.Router.extend({
  routes: {
    '': 'list',
    'detail/:id': 'detail'
  },

  list: function() {
    var listView = new ListView({ collection: facilities });

    listView.render();

    // render when facilities is reset
    listView.listenTo(facilities, 'reset', function() {
      listView.render();
    });

    // run a default query
    if ( facilities.length === 0 ) {
      Query.submit({})
      .done(function(results) {
        facilities.reset(results.data);
      })
      .fail(function(err) {
        console.error(err);
      });
    }
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
  }
});

var instance = new Router();
module.exports = { instance: instance };
