var _     = require('underscore'),
    Hours = require('cloud/models/hours');

module.exports = Parse.Object.extend('Facility', {
  initialize: function() { 
    this.set("services", []);
  },
  // no gender restriction or gender == self.gender
  matchesGender: function(targetGender) {
    var g = this.get('gender');

    if ( !g || !targetGender )  {
      return true;
    } else {
      return g.toUpperCase() == targetGender.toUpperCase();
    }
  },

  presentJSON: function() {
    var asJSON = this.toJSON();
    asJSON.services = this.get('services').map(function(service) {
      return service.toJSON();
    });
    asJSON.demographics = this.demographics();
    return asJSON;
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

  hasKnownStatus: function() {
    return (this.status() !== 'unknown');
  },

  status: function() {
    var open;

    if ( this._status ) return this._status;

    // wrap in try because we may not have data or the data may not parse
    try {
      open = this.hours().within(new Date());
    } catch (e) {
      console.log(e);
    }

    if ( open === true ) {
      this._status = 'open';
    } else if ( open === false ) {
      this._status = 'closed';
    } else {
      this._status = 'unknown';
    }

    return this._status;
  },

  hours: function() {
    if(this._hours) { return this._hours; }
    this._hours = new Hours(this.get('hours'));
    return this._hours;
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
  },

  age_as_string: function(input) {
    switch ( input.toUpperCase() ) {
      case "C":
        return "children";
      case "Y":
        return "teens";
      case "A":
        return "adults";
      case "S":
        return "seniors";
    }
  },

  demographics: function() {
    var g, a, output = "";
    if ( !this.get('age') && !this.get('gender') ) {
      output = "Anyone";
    } else {
      if ( (g = this.get('gender') ) ) {
        if ( this.get('age') ) {
          output = g.toUpperCase() == "F" ? "Female " : "Male ";
        } else {
          output = "Only " + g.toUpperCase() == "F" ? "women" : "men";
        }
      } else {
        output = "All ";
      }

      if ( (a = this.get('age') ) ) {
        // C-Y-A-S
        var translated = _(a).map(this.age_as_string);
        output += _(translated).join(", ");
      }
    }
    return output;
  }
});
