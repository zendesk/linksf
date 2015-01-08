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
      return g.toUpperCase() === targetGender.toUpperCase();
    }
  },

  presentJSON: function() {
    var asJSON = this.toJSON();

    asJSON.services = this.get('services').map(function(service) {
      return new Service(service.attributes).presentJSON();
    });
    asJSON.demographics = this.demographics();
    asJSON.distinctCategories = this.distinctCategories();
    asJSON.condensedHours = this.openHours().humanizeCondensed({shortDayNames: true});
    asJSON.openHours = this.openHours().humanize();
    asJSON.phoneNumbers = this.phoneNumbers();
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

  matchesOpen: function(status, date) {
    if ( !status ) return true;

    return this.status(date) === 'open';
  },

  matchesFilter: function(filter) {
    if ( !filter ) return true;

    return this.hasServiceInCategories(filter.categories) &&
           this.matchesOpen(filter.open, filter.date) &&
           this.matchesGender(filter.gender) &&
           this.matchesAges(filter.age);
  },

  status: function(date) {
    var open;

    if ( this._status ) return this._status;

    open = this.hasOpenService(date || new Date());

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

  ageAsString: function(input) {
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
          output = gender.toUpperCase() === "F" ? "Female " : "Male ";
        } else {
          output = gender.toUpperCase() === "F" ? "Women" : "Men";
        }
      } else {
        output = "All ";
      }

      if ( age ) {
        // C-Y-A-S
        var translated = _(age).map(this.ageAsString);
        output += _(translated).join(", ");
      }
    }
    return output;
  },

  phoneNumbers: function() {
    return this.get('phoneNumbers') || [{number: this.get('phone'), info: ''}];
  },

  distinctCategories: function() {
    var s = [], h = {};
    _.each(this.get("services"), function(service) {
      var cat = service.get("category");
      if ( !h[cat] ) {
        h[cat] = 1;
        s.push(_.find(CATEGORIES, function(e) { return e.key === cat; }));
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
