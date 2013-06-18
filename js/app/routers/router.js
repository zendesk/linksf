/*globals window*/
var $ = require('jquery'),
    Backbone = require('backbone'),
    DetailView = require('views/detail_view'),
    ListView = require('views/list_view'),
    EditView = require('views/edit_view'),
    IndexView = require('views/index_view'),
    AdminListView = require('views/admin_list_view'),
    Query = require('lib/query'),
    _ = require('underscore'),
    facilities = require('collections/facilities').instance;

var Router = Backbone.Router.extend({
  routes: {
    '': 'index',
    'list': 'index',
    'query/:category': 'query',
    'detail/:id': 'detail',
    'edit/:id': 'edit'
  },

  listView: null,

  listViewClass: ListView,

  index: function() {
    var indexView = new IndexView();
    return indexView.render();
  },

  query: function(category) {
    var listViewClass = this.listViewClass,
        self = this;
    Query.submit({
      filter: {
        categories: [category]
      },
      limit: 20
    }).done(function(results) {
      facilities.reset(results.data);

      self.listView = self.listView || new listViewClass({collection: facilities});
      self.listView.options.categories = [category];
      self.listView.offset = results.offset;
      self.listView.render();
      window.scrollTo(0, 0); // Scroll to top

    });
  },

  list: function() {
    var listView = this.listView || new this.listViewClass({collection: facilities});
    listView.collection = facilities;

    listView.render();

    // run a default query
    if ( facilities.length === 0 ) {
      listView.submitQuery();
    }
  },

  renderFacility: function(facility) {
    var detailView = new DetailView({ model: facility.presentJSON() });
    detailView.render();
    window.scrollTo(0, 0); // Scroll to top
    return detailView;
  },

  renderEdit: function(facility) {
    var editView = new EditView({ model: facility });
    return editView.render();
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
