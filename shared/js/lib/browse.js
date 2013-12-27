var Facility         = require('cloud/models/facility'),
    spacesRegex      = /\s+/g,
    punctuationRegex = /[^\d\w\s']/g,
    possessionRegex  = /'s/g;

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

  var sort = params.sort || 'name',
      limit = params.limit || 10,
      filter = params.filter || {},
      offset = params.offset || 0,
      search = params.search,
      sanitized,
      geopoint,
      lat = params.lat,
      lon = params.lon,
      q = new Parse.Query(Facility);

  if ( sort === 'near' && lat && lon ) {
    geopoint = new Parse.GeoPoint(lat, lon);
    q.near('location', geopoint);
  } else {
    q.ascending('name');
  }

  if ( search ) {
    sanitized = search.trim()
                      .replace(spacesRegex, ' ')
                      .replace(punctuationRegex, '$&?')
                      .replace(possessionRegex, '($&)?');

    q.matches('name', sanitized, 'i');
  }

  q.limit(5000);
  q.include('services');
  q.skip(offset);

  q.find().then(function(results) {
    var filtered = [];

    results.forEach(function(f) {
      if ( filtered.length >= limit ) return;

      if ( f.matchesFilter(filter) ) {
        filtered.push(f);
      }

      offset++;
    });
    callbacks.success([offset].concat(filtered));
  }, function(err) {
    callbacks.error(err);
  });
};
