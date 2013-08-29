/*globals window*/
var $                     = require('jquery'),
    _                     = require('underscore'),
    Backbone              = require('backbone'),
    BaseController        = require('lib/base_controller'),
    AdminListView         = require('views/admin_list_view'),
    DetailView            = require('views/detail_view'),
    EditView              = require('views/edit_view'),
    FilterView            = require('views/filter_view'),
    IndexView             = require('views/index_view'),
    ListView              = require('views/list_view'),
    AboutView             = require('views/about_view'),
    Query                 = require('lib/query'),
    applicationController = new BaseController({ el: '#linksf' }),
    facilities            = require('collections/facilities').instance;

var Router = Backbone.Router.extend({
  routes: {
    '':                   'index',
    'query?:queryString': 'query',
    'query':              'query',
    'detail/:id':         'detail',
    'edit/:id':           'edit',
    'about' :             'about',
    'filter':             'filter'
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

    this.listView = self.listView || new listViewClass({ collection: facilities, isSingleton: true });

    queryParams = this.listView.generateQueryParams(queryString);
    queryParams.limit = 20;

    this.listView.submitQuery(queryParams).done(function(results) {
      self.listView.options.categories = queryParams.filter.categories || [];
      applicationController.render(self.listView);
      window.scrollTo(0, 0); // Scroll to top
    });
  },

  filter: function() {
    this.filterView = this.filterView || new FilterView({isSingleton: true });
    applicationController.render(this.filterView);
  },

  renderFacility: function(facility) {
    var detailView = new DetailView({ model: facility.presentJSON() });
    window.scrollTo(0, 0); // Scroll to top
    return applicationController.render(detailView);
  },

  renderEdit: function(facility) {
    var editView = new EditView({ model: facility });
    return applicationController.render(editView);
  },

  detail: function(id) {
    this._getFacility(id, function(facility) {
      this.renderFacility(facility);
    }.bind(this));
  },

  edit: function(id) {
    this._getFacility(id, function(fac) {
      this.renderEdit(fac);
    }.bind(this));
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
