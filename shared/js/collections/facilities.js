var Facility = require('../models/facility');
var instance;

var Facilities = Parse.Collection.extend({
  model: Facility
});

module.exports = {
  instance: function() {
    if ( instance ) { return instance; }
    instance = new Facilities();
    return instance;
  }
};
