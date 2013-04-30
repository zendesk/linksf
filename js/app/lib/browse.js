module.exports = function (params, callbacks) {
  var _ = require('underscore'),
      Facility = require('cloud/models/facility'),
      parse;

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

  // q.limit(limit);
  q.include('services');
  q.skip(offset);

  var resp = [];

  q.find().then(function(results) {
    var filteredResults = [];

    _.each(results, function(f) {
      if ( filteredResults.length >= limit ) 
        return;

      if ( f.matchesFilter(filter) ) {
        filteredResults.push(f);
      }
      offset++;
    });
    callbacks.success({offset: offset, data: filteredResults});
  }, function(err) {
    callbacks.error(err);
  });
};

