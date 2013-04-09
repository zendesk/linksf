var _ = require('underscore');

module.exports = Parse.Object.extend('Facility', {
  // no gender restriction or gender == self.gender
  matchesGender: function(targetGender) {
    var g = this.get('gender');

    if ( !g || !targetGender )  {
      return true;
    } else {
      return g.toUpperCase() == targetGender.toUpperCase();
    }
  },

  matchesAges: function(ages) {
    var a = this.get('age');
    if ( !ages || !a ) {
      return true;
    }

    return _.any(_.compact(ages), function(targetAge) {
      return _.include(a, targetAge);
    });
  }
});
