var Facility = require('shared/models/facility');

var Facilities = Parse.Collection.extend({
  model: Facility
});

var instance;

module.exports = {
  instance: function() {
    if ( instance ) { return instance; }

    instance = new Facilities();

    return instance;
  }
};
