var Parse       = require('parse');
var _           = require('underscore');
var Facility    = require('cloud/models/facility');

var Facilities = Parse.Collection.extend({
  initialize: function(filter) {
    this.filter = filter;
  },

  add: function(models, options) {
    models = _.isArray(models) ? models.slice() : [models];
    _.each(models, function(m) {
      if ( !m.matchesFilter || m.matchesFilter(this.filter) ) {
        Parse.Collection.prototype.add.call(this, [m], options);
      }
    }.bind(this));
  },

  more: function() {
  }
});

var instance = new Facilities();
module.exports = { instance: instance };
