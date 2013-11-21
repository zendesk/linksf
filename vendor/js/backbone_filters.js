this.originalRoute = Backbone.Router.prototype.route;

_.extend(Backbone.Router.prototype, this, {
  beforeAllFilters: [],

  runFilters: function(route, callback) {
    var filters = this.beforeAllFilters();
    var proceed = true;
    for (i = 0; i < filters.length; i++) {
      proceed = filters[i].call(this, route, callback);
      if (!proceed) break;
    }
    return proceed;
  },

  route: function(route, name, callback) {
    if (!_.isRegExp(route)) route = this._routeToRegExp(route);
    if (!callback) callback = this[name];
    Backbone.history.route(route, _.bind(function(fragment) {
      if (this.runFilters(route, callback)) {
        var args = this._extractParameters(route, fragment);
        callback && callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
        Backbone.history.trigger('route', this, name, args);
      }
    }, this));
    return this;
  }
});
