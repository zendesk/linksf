var Backbone = require('backbone'),
    Facility = require('models/facility');

var Facilities = Backbone.Collection.extend({
  model: Facility
});

module.exports = Facilities;
