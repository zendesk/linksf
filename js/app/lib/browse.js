module.exports = function (params, callbacks) {
  var parse;
  if ( typeof Parse == 'undefined' ) {
    // can't require parse from within parse cloud.  seems silly.
    parse = require('parse');
  } else {
    parse = Parse;
  }

  var _        = require('underscore');

  var Facility = parse.Object.extend("Facility");
  var Service  = parse.Object.extend("Service");

  // all params are optional, NULL or missing means don't filter
  // {
  //  sort: 'near'|'name'
  //  limit: int (default 10)
  //  filter:
  //    {isOpen: true,
  //     gender: 'M'|'F'
  //     age: ['C', 'Y', 'A', 'S'] // children, youth, adult, senior
  //     categories: ['medical', 'hygiene', 'food', 'shelter']
  //    }
  //  }
  //
  //
  var facilityMatchesFilter = function(facility, filter) {
    if ( !filter ) {
      return true;
    }

    if ( filter.gender && filter.gender !== facility.get("gender") ) {
      return false;
    }

    if ( filter.age && facility.get("age") ) {
      var matches = _.any(_.compact(filter.age), function(targetAge) {
        return _.include(facility.get("age"), targetAge);
      });
      if ( !matches ) {
        return false;
      }
    }
    return true;
  };
 

  var sort = params.sort || 'name';
  var limit = params.limit || 10;
  var filter = params.filter || {};

  var q = new parse.Query(Facility);

  if ( sort === 'near' ) {
    if ( !(params.lat && params.lon) ) {
      return callbacks.error("Please provide a lat and lon");
    }

    var geopoint = new parse.GeoPoint(params.lat, params.lon);
    q.near('location', geopoint);
  } else {
    q.ascending('name');
  }

  q.limit(limit);

  var resp = [];
  q.find({
    success: function(rows) {
      var matching = _.select(rows, function(facility) {
        return ( facilityMatchesFilter(facility, filter) );
      });
      callbacks.success(matching);
    }, error: function(err) {
      console.log(err);
      callbacks.error(err);
    }
  });
};
