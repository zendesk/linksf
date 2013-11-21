var Facility = require('cloud/models/facility'),
    _ = require('underscore');

module.exports = function (params, callbacks) {

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
  var offset = params.offset || 0;
  var search = params.search;

  var q = new Parse.Query(Facility);

  if ( sort === 'near' ) {
    if ( !(params.lat && params.lon) ) {
      return callbacks.error("Please provide a lat and lon");
    }

    var geopoint = new Parse.GeoPoint(params.lat, params.lon);
    q.near('location', geopoint);
  } else {
    q.ascending('name');
  }

  if ( search ) {
    q.matches('name', search, "i");
  }

  q.limit(5000);
  q.include('services');
  q.skip(offset);

  var resp = [];

  q.find().then(function(results) {
    var filteredResults = [];

    results.forEach(function(f) {
      if ( filteredResults.length >= limit ) {
        return;
      }

      if ( f.matchesFilter(filter) ) {
        filteredResults.push(f);
      }
      offset++;
    });
    callbacks.success([offset].concat(filteredResults));
  }, function(err) {
    callbacks.error(err);
  });
};

