var Facility         = require('cloud/models/facility'),
    spacesRegex      = /\s+/g,
    punctuationRegex = /[^\d\w\s']/g,
    possessionRegex  = /'s/g;

function sanitize(input) {
  return input
    .trim()
    .replace(spacesRegex, ' ')
    .replace(punctuationRegex, '$&?')
    .replace(possessionRegex, '($&)?');
}

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
      lat = params.lat,
      lon = params.lon,
      millisecondOffset = (params.tzOffset - (new Date()).getTimezoneOffset()) * 60 * 1000,
      sanitized,
      geopoint,
      q = new Parse.Query(Facility);

  filter.date = new Date(new Date().getTime() - millisecondOffset);

  console.log("filter.date === " + filter.date);
  if ( sort === 'near' && lat && lon ) {
    geopoint = new Parse.GeoPoint(lat, lon);
    q.near('location', geopoint);
  } else {
    q.ascending('name');
  }

  if ( search ) {
    q.matches('name', sanitize(search), 'i');
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
