var Parse       = require('parse');
var _           = require('underscore');
var Facility    = require('models/facility');

module.exports = Parse.Collection.extend({
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
}, {});
