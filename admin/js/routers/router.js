/*globals window */

var AdminListView         = require('views/list_view'),
    EditView              = require('views/edit_view'),
    LoginView             = require('views/login_view'),
    Facility              = require('shared/models/facility'),
    Query                 = require('shared/lib/query'),
    BaseController        = require('shared/lib/base_controller'),
    applicationController = new BaseController({ el: '#linksf' }),
    facilities            = require('shared/collections/facilities').instance();

var Router = Backbone.Router.extend({

  beforeAllFilters: function() {
    return [this.authenticationFilter];
  },

  authenticationFilter: function (route, callback) {
    if ( typeof route === "object" ) {
      route = "";
    }

    var currentUser = Parse.User.current();
    if (currentUser) {
      $('#navUserLogout').show();
      $('#navUserInfo').html("logged in as " + currentUser.get('username'));
      return true;
    } else {
      $('#navUserLogout').hide();
      $('#navUserInfo').html("");
      this.navigate('login', {replace: true, trigger: false});
      this.login(route);
      return false;
    }
  },

  routes: {
    '':                   'list',
    'list':               'list',
    'query?:queryString': 'query',
    'query':              'query',
    'login':              'login',
    'logout':             'logout',
    // 'detail/:id':         'detail',
    'edit/:id':           'edit',
    'new':                'newFacility'
  },

  listView: null,

  list: function() {
    var listView = this.listView || new AdminListView({collection: facilities});
    listView.collection = facilities;

    // run a default query
    if ( facilities.length === 0 ) {
      listView.submitQuery({limit: 4000});
    }

    applicationController.render(listView);
  },

  renderEdit: function(facility) {
    var editView = new EditView({ model: facility });
    window.scrollTo(0, 0);
    return applicationController.render(editView);
  },

  edit: function(id) {
    this._getFacility(id, function(fac) {
      this.renderEdit(fac);
    }.bind(this));
  },

  newFacility: function() {
    this.renderEdit(new Facility());
  },
  query: function(queryString) {
    var adminListViewClass = this.adminListViewClass,
        self          = this,
        queryParams;

    var listView = this.listView || new AdminListView({collection: facilities});

    applicationController.render(listView);
    listView.showSpinner();
    window.scrollTo(0, 0);
    queryParams       = listView.generateQueryParams(queryString, 1000);
    listView.selectedCategories = queryParams;
    listView.submitQuery(queryParams).done(function(results) {
      listView.hideSpinner();

      window.scrollTo(0, 0); // Scroll to top
    }).fail(function() {
      console.log('submitQuery error', arguments);
      listView.hideSpinner();
    });

  },
  login: function(return_to) {
    return new LoginView(this, return_to).render();
  },

  logout: function() {
    Parse.User.logOut();
    this.navigate('login', {replace: true, trigger: true});
  },

  // todo -- move this into facility collection
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

var instance;

module.exports = {
  instance: function() {
    if ( instance ) { return instance; }

    instance = new Router();

    return instance;
  }
};
