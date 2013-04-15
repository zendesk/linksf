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
  }, 

  matchesFilter: function(filter) {
    var match = true;

    if ( !filter ) {
      return true;
    }

    match &= this.matchesGender(filter.gender);
    match &= this.matchesAges(filter.age);
    match &= this.hasServiceInCategories(filter.categories);
    return match;
  },

  hasServiceInCategories: function(categories) { 
    if ( !categories )  {
      return true;
    }

    var services = this.get('services');
    return _.any(_.compact(categories), function(targetCategory) { 
      return _.any(services, function(facService) {
        return facService.get("category") === targetCategory;
      });
    });
  }
});
