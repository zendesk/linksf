/*globals window, alert */
var $                     = require('jquery'),
    _                     = require('underscore'),
    Facility              = require('cloud/models/facility'), // we don't use the models here in the router, 
    Service               = require('cloud/models/service'),  // but loading them lets parse convert results to them */
    Backbone              = require('backbone'),
    BaseController        = require('lib/base_controller'),
    DetailView            = require('views/detail_view'),
    FilterView            = require('views/filter_view'),
    IndexView             = require('views/index_view'),
    ListView              = require('views/list_view'),
    AboutView             = require('views/about_view'),
    Query                 = require('lib/query'),
    applicationController = new BaseController({ el: '#linksf' }),
    facilities            = require('collections/facilities').instance,
    FacilityCollection    = require('collections/facilities').FacilityCollection,
    fetchLocation         = require('cloud/lib/fetch_location'),
    parseParams           = require('lib/query_param_parser');

var Router = Backbone.Router.extend({
  routes: {
    '':                    'index',
    'query?:queryString':  'query',
    'query':               'query',
    'detail/:id':          'detail',
    'about' :              'about',
    'filter?:queryString': 'filter'
  },

  listView: null,

  listViewClass: ListView,
  initialize: function() {
    this.routesHit = 0;
    //keep count of number of routes handled by your application
    Backbone.history.on('route', function() { this.routesHit++; }, this);
  },
  back: function() {
    if(this.routesHit > 1) {
      //more than one route hit -> user did not land to current page directly
      window.history.back();
    } else {
      //otherwise go to the home page. Use replaceState if available so
      //the navigation doesn't create an extra history entry
      this.navigate('', {trigger:true, replace:true});
    }
  },
  index: function() {
    var indexView = new IndexView();
    return applicationController.render(indexView);
  },

  query: function(queryString) {
    var listViewClass = this.listViewClass,
        self          = this,
        queryParams;

    this.listView = this.listView || new listViewClass({ collection: facilities, isSingleton: true });

    fetchLocation().always(function(loc) {
      queryParams       = self.listView.generateQueryParams(queryString);
      queryParams.limit = 20;
      self.listView.options.categories = queryParams.filter.categories || [];
      if (loc.lon && loc.lat) {
        $.extend(queryParams, loc);
        self.listView.options.currentLocation = loc;
      }
      applicationController.render(self.listView);
      self.listView.showSpinner();
      window.scrollTo(0, 0);

      self.listView.submitQuery(queryParams).done(function(results) {
        self.listView.hideSpinner();
        window.scrollTo(0, 0); // Scroll to top
      }).fail(function() {
        console.log('submitQuery error', arguments);
        self.listView.hideSpinner();
      });
    });

  },

  filter: function(queryString) {
    var self   = this,
        params = parseParams(queryString);

    fetchLocation().always(function(loc) {
      self.filterView = self.filterView || new FilterView({isSingleton: true });
      self.filterView.options.params = params;

      if (loc.lon && loc.lat) {
        self.filterView.options.currentLocation = loc;
      }

      applicationController.render(self.filterView);
    });
  },

  renderFacility: function(facility, options) {
    var detailView = new DetailView({ model: facility.presentJSON() });
    if (options) { detailView.options = options; }
    window.scrollTo(0, 0); // Scroll to top
    return applicationController.render(detailView);
  },

  detail: function(id) {
    var self = this, options = {};

    fetchLocation().always(function(loc) {
      if (loc.lon && loc.lat) {
        options.currentLocation = loc;
      }

      self._getFacility(id, function(facility) {
        self.renderFacility(facility, options);
      });
    });
  },

  about: function() {
    this.aboutView = this.aboutView || new AboutView();
    applicationController.render(this.aboutView);
  },

  _getFacility: function(id, done) {
    var facility = facilities.get(id);

    if ( !facility ) {
      //Fetch Facility from backend if not in collection
      Query.getByID(id).then(function(facility) {
        done(facility);
      });
    } else {
      done(facility);
    }
  }
});

var instance = new Router();
module.exports = { instance: instance };
