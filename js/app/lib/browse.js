var $ = require('jquery'),
    _ = require('underscore'),
    Facility = require('cloud/models/facility'),
    parse;

if ( typeof Parse == 'undefined' ) {
  // can't require parse from within parse cloud.  seems silly.
  parse = require('parse');
} else {
  parse = Parse;
}

var DEFAULT_OPTIONS = {
  sort: 'name',
  limit: 10,
  filter: {},
  offset: 0
};

var Browse = function(params, callbacks) {
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

  var filter = params.filter || {};
  var options = $.extend({}, params, DEFAULT_OPTIONS),
      query = new parse.Query(Facility);

  console.log(options);
  console.log(options.filter);
  if ( options.sort === 'near' ) {
    if ( !(options.lat && options.lon) ) {
      return callbacks.error("Please provide a lat and lon");
    }

    var geopoint = new parse.GeoPoint(params.lat, params.lon);
    query.near('location', geopoint);
  } else {
    query.ascending('name');
  }

  // query.limit(limit);
  query.include('services');
  query.skip(options.offset);

  var resp = [];

  console.log(query.filter);
  query.find().then(function(results) {
    var filteredResults = [];

    _.each(results, function(result) {
      if ( filteredResults.length >= options.limit )
        return;

      if ( result.matchesFilter(filter) ) {
        filteredResults.push(result);
      }
      options.offset++;
      console.log(options.offset);
    });
    callbacks.success({offset: options.offset, data: filteredResults});
  }, function(err) {
    callbacks.error(err);
  });
};

module.exports = Browse;
