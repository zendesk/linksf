module.exports = function (params, callbacks) {
  var parse;
  if ( typeof Parse == 'undefined' ) {
    // can't require parse from within parse cloud.  seems silly.
    parse = require('parse');
  } else {
    parse = Parse;
  }

  var _        = require('underscore');

  var Facility           = require('models/facility');
  var FacilityCollection = require('models/facilityCollection');
  var Service            = require('models/service');

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
  q.include('services');

  var resp = [];
  var QueryCollection = FacilityCollection.extend({
    model: Facility, 
    query: q
  });

  var collection = new QueryCollection(filter);
  collection.fetch(callbacks);
};

