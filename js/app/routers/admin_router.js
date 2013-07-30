var $                     = require('jquery'),
    Backbone              = require('backbone'),
    AdminListView         = require('views/admin_list_view'),
    EditView              = require('views/edit_view'),
    LoginView             = require('views/login_view'),
    DetailView            = require('views/detail_view'),
    Facility              = require('cloud/models/facility'),
    Query                 = require('lib/query'),
    _                     = require('underscore'),
    BaseController        = require('lib/base_controller'),
    applicationController = new BaseController({ el: '#linksf' }),
    facilities            = require('collections/facilities').instance;

require('backbone-filters')();

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
    '':                'list',
    'list':            'list',
    'login':           'login',
    'logout':          'logout',
    'detail/:id':      'detail',
    'edit/:id':        'edit',
    'new':             'newFacility'
  },

  listView: null,

  list: function() {
    var listView = this.listView || new AdminListView({collection: facilities});
    listView.collection = facilities;

    // run a default query
    if ( facilities.length === 0 ) {
      listView.performQuery({limit: 4000});
    }

    applicationController.render(listView);
  },

  renderFacility: function(facility) {
    var detailView = new DetailView({ model: facility.presentJSON() });
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

  newFacility: function() {
    this.renderEdit(new Facility());
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

var instance = new Router();
module.exports = { instance: instance };

