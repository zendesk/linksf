/*globals Backbone*/

var BaseController        = require('shared/lib/base_controller'),
    applicationController = new BaseController({ el: '#linksf' }),
    facilities            = require('shared/collections/facilities').instance(),
    fetchLocation         = require('shared/lib/fetch_location');

var Router = Backbone.Router.extend({
  routes: {
    '':                   'index',
    'query?:queryString': 'query',
    'query':              'query',
    'detail/:id':         'detail',
    'about' :             'about',
    'filter':             'filter'
  },

  listView: null,

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
    var IndexView = require('views/index_view'),
        indexView = new IndexView();
    return applicationController.render(indexView);
  },

  query: function(queryString) {
    var ListView  = require('shared/views/list_view');

    this.listView = this.listView || new ListView({ collection: facilities, isSingleton: true });

    fetchLocation().always(function(loc) {
      var queryParams = this.listView.generateQueryParams(queryString);

      queryParams.limit = 20,
      this.listView.options.categories = queryParams.filter.categories || [];

      if (loc.lon && loc.lat) {
        $.extend(queryParams, loc);
        this.listView.options.currentLocation = loc;
      }
      applicationController.render(this.listView);
      this.listView.showSpinner();
      window.scrollTo(0, 0);

      this.listView.submitQuery(queryParams).done(function(results) {
        this.listView.hideSpinner();
        window.scrollTo(0, 0); // Scroll to top
      }.bind(this)).fail(function() {
        console.log('submitQuery error', arguments);
        this.listView.hideSpinner();
      }.bind(this));
    }.bind(this));

  },

  filter: function() {
    var FilterView = require('views/filter_view'),
        self = this;

    fetchLocation().always(function(loc) {
      self.filterView = self.filterView || new FilterView({isSingleton: true });

      if (loc.lon && loc.lat) {
        self.filterView.options.currentLocation = loc;
      }

      applicationController.render(self.filterView);
    });
  },

  renderFacility: function(facility, options) {
    var DetailView = require('views/detail_view'),
        detailView = new DetailView({ model: facility.presentJSON() });
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
    var AboutView = require('views/about_view');

    this.aboutView = this.aboutView || new AboutView();
    applicationController.render(this.aboutView);
  },

  _getFacility: function(id, done) {
    var facility = facilities.get(id),
        query = require('shared/lib/query');

    if ( !facility ) {
      //Fetch Facility from backend if not in collection
      query.getByID(id).then(function(facility) {
        done(facility);
      });
    } else {
      done(facility);
    }
  }
});

var instance;

module.exports = {
  instance: function() {
    if ( instance ) { return instance; }

    instance = new Router();

    return instance;
  }
};
