var _     = require('underscore'),
    Hours = require('cloud/models/hours'),
    Service = require('cloud/models/service'),
    CATEGORIES = require('cloud/lib/categories');

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
      return new Service(service.attributes).presentJSON();
    });
    asJSON.demographics = this.demographics();
    asJSON.distinctCategories = this.distinctCategories();
    asJSON.condensedHours = this.openHours().humanizeCondensed();
    asJSON.openHours = this.openHours().humanize();
    return asJSON;
  },

  openHours: function() {
    return Hours.merge.apply(
      Hours,
      this.get("services").map(function(service) {
        return Hours.fromData(service.get("openHours"));
      })
    );
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

  matchesOpen: function(status) {
    if ( !status ) {
      return true;
    }

    var s = this.status();
    return s === 'open';
  },

  matchesFilter: function(filter) {
    var match = true;
    if ( !filter ) {
      return true;
    }

    match &= this.matchesGender(filter.gender);
    match &= this.matchesAges(filter.age);
    match &= this.hasServiceInCategories(filter.categories);
    match &= this.matchesOpen(filter.open);
    return match;
  },

  status: function() {
    var open;

    if ( this._status ) return this._status;

    open = this.hasOpenService(new Date());

    if ( open === true ) {
      this._status = 'open';
    } else if ( open === false ) {
      this._status = 'closed';
    } else {
      this._status = 'unknown';
    }

    return this._status;
  },

  hasOpenService: function(time) {
    var services = this.get('services');
    var Service = require('shared/models/service');
    try {
      return _.any(services, function(parseObject) {
        var service = new Service(parseObject.attributes);
        return service.hours().within(time);
      });
    } catch(e) {
      return null;
    }
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
    var age = this.get('age'),
        gender = this.get('gender'),
        output = "";

    if ( (!age || age.length === 0) && (!gender) ) {
      output = "Everyone";
    } else {
      if ( gender ) {
        if ( age ) {
          output = gender.toUpperCase() == "F" ? "Female " : "Male ";
        } else {
          output = "Only " + (gender.toUpperCase() == "F" ? "women" : "men");
        }
      } else {
        output = "All ";
      }

      if ( age ) {
        // C-Y-A-S
        var translated = _(age).map(this.age_as_string);
        output += _(translated).join(", ");
      }
    }
    return output;
  },

  distinctCategories: function() {
    var s = [], h = {};
    _.each(this.get("services"), function(service) {
      var cat = service.get("category");
      if ( !h[cat] ) {
        h[cat] = 1;
        s.push(_.find(CATEGORIES, function(e) { return e.key == cat; }));
      }
    });
    return s;
  },

  destroy: function() {
    var promises = [];
    this.get("services").forEach(function(s) { promises.push(s.destroy()); });
    promises.push(Parse.Object.prototype.destroy.call(this));
    return Parse.Promise.when(promises);
  }
});
