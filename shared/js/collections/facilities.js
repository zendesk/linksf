var Facility = require('shared/models/facility');

var Facilities = Parse.Collection.extend({
  model: Facility
});

var instance = new Facilities();
module.exports = { instance: instance };
