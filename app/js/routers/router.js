var Analytics             = require('../../../shared/js/lib/analytics'),
    BaseController        = require('../../../shared/js/lib/base_controller'),
    Storage               = require('../lib/storage'),
    applicationController = new BaseController({ el: '#linksf' }),
    facilities            = require('../../../shared/js/collections/facilities').instance(),
    fetchLocation         = require('../../../shared/js/lib/fetch_location'),
    parseParams           = require('../../../shared/js/lib/query_param_parser');

var Router = Backbone.Router.extend({
  beforeAllFilters: function() { return [ this.checkPrivateBrowsing, this.trackRoute ]; },

  checkPrivateBrowsing: function() {
    // https://parse.com/questions/private-browsing-breaks-login-is-there-a-workaround
    try {
      window.localStorage.setItem('checkPrivateBrowsing', '1');
      window.localStorage.removeItem('checkPrivateBrowsing');
      return true;
    } catch (e) {
      Parse.localStorage = new Storage('local');
      return true;
    }
  },

  trackRoute: function(routeRegex) {
    var match = routeRegex.toString().match(/\/\^(\w*)/);
    if (match) {
      var route = _.isEmpty(match[1]) ? 'index' : match[1];
      Analytics.trackRoute(route);
    }
    return true;
  },

  routes: {
    '':                    'index',
    'index':               'index',
    'query?:queryString':  'query',
    'query':               'query',
    'detail/:id':          'detail',
    'about':               'about',
    'feedback':            'feedback',
    'terms':               'terms',
    'filter':              'filter',
    'filter?:queryString': 'filter'
  },

  listView: null,
  lastSearch: '',

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
      Backbone.history.navigate('', {trigger:true, replace:true});
    }
  },

  index: function() {
    var IndexView = require('../views/index_view'),
        indexView = new IndexView();

    fetchLocation().always(function(loc) {
      var hasLocation = loc && loc.lon && loc.lat;
      if (!hasLocation) return;

      Analytics.trackLocation('homePage', loc);
    });

    return applicationController.render(indexView);
  },

  query: function(queryString) {
    var parsedParams = parseParams(queryString),
        ListView     = require('../../../shared/js/views/list_view');
    this.listView = this.listView || new ListView({ collection: facilities, isSingleton: true });

    Analytics.trackQuery(parsedParams);
    applicationController.render(this.listView);
    if ( queryString === this.lastSearch ) { return; }
    this.lastSearch = queryString;
    this.listView.showSpinner(); // Show the spinner before fetching location, changes the UI much faster

    fetchLocation().always(function(loc) {
      var queryParams = this.listView.generateQueryParams(queryString);
      queryParams.limit = 20,
      this.listView.options.categories = queryParams.filter.categories || [];

      this.listView.options.disabledLocation = false;
      if (loc.lon && loc.lat) {
        $.extend(queryParams, loc);
        this.listView.options.currentLocation = loc;
        Analytics.trackLocation('query', loc, parsedParams);
      } else {
        // Default sort is near when navigating from index, unset it if location isn't available
        delete queryParams.sort;
        this.listView.options.disabledLocation = true;
      }

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

  filter: function(queryString) {
    var FilterView = require('../views/filter_view'),
        params = parseParams(queryString);

    fetchLocation().always(function(loc) {
      this.filterView = this.filterView || new FilterView({isSingleton: true });
      this.filterView.options.params = params;

      if (loc.lon && loc.lat) {
        this.filterView.options.currentLocation = loc;
      }

      applicationController.render(this.filterView);
    }.bind(this));
  },

  renderFacility: function(facility, options) {
    var DetailView = require('../views/detail_view'),
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
    var AboutView = require('../views/about_view');
    this.aboutView = this.aboutView || new AboutView();
    applicationController.render(this.aboutView);
  },

  feedback: function() {
    var FeedbackView = require('../views/feedback_view');
    this.feedbackView = this.feedbackView || new FeedbackView();
    applicationController.render(this.feedbackView);
  },

  terms: function() {
    var TermsView = require('../views/terms_view');
    this.termsView = this.termsView || new TermsView();
    applicationController.render(this.termsView);
  },

  _getFacility: function(id, done) {
    var facility = facilities.get(id),
        query = require('../../../shared/js/lib/query');

    if ( !facility ) {
      //Fetch Facility from backend if not in collection
      query.findById(id).then(function(facility) {
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
