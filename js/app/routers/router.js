var $ = require('jquery'),
    Backbone = require('backbone'),
    DetailView = require('views/detail_view'),
    ListView = require('views/list_view'),
    AdminListView = require('views/admin_list_view'),
    Query = require('lib/query'),
    _ = require('underscore'),
    facilities = require('collections/facilities').instance;

var Router = Backbone.Router.extend({
  routes: {
    '': 'list',
    'detail/:id': 'detail'
  },

  listViewClass: ListView,

  list: function() {
    var listView = new this.listViewClass({ collection: facilities });

    listView.render();
    $('#query').hide();

    // render when facilities is reset
    listView.listenTo(facilities, 'reset', function() {
      listView.render();
    });

    // run a default query
    if ( facilities.length === 0 ) {
      listView.submitQuery();
    }
  },

  renderFacility: function(facility) {
    var facilityAsJSON = facility.toJSON();
    facilityAsJSON.services = _.map(facility.get("services"), function(service) {
      return service.toJSON();
    });

    var detailView = new DetailView({ model: facilityAsJSON });
    return detailView.render();
  },

  detail: function(id) {
    var facility = facilities.get(id);

    if ( !facility ) {
      //Fetch Facility from backend if not in collection
      Query.getByID(id).then(function(facility) {
        this.renderFacility(facility);
      }.bind(this));
    } else {
      return this.renderFacility(facility);
    }
  }
});

var instance = new Router();
module.exports = { instance: instance };
