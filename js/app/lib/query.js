var $ = require('jquery'),
    _ = require('underscore');

var location = function(hasGeolocation) {
  var lat, lon;

  if ( hasGeolocation ) {
    navigator.geolocation.getCurrentPosition(function(position) {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
    }, function(error) {
      console.log(error);
    });
  } else {
    // for local development
    lat = 37.782355;
    lon = -122.409825;
  }

  return {lat: lat, lon: lon};
};

var dumpToDOM = function(result) {
  var results = $('#results');
  results.empty();
  results.append("results available at $('#results').data('results')\n\n");

  _.each(result, function(fac) {
    fac.set("services",
      _.map(fac.get('services'), function(s) { return s.attributes; } )
      );
    results.append(JSON.stringify(fac, null, '  '));
    results.append("\n");
  });
  results.data('results', result);
};

var queryFunction = function(runInCloud) {
  if ( runInCloud ) {
    return _.partial(Parse.Cloud.run, "browse");
  } else {
    return require('lib/browse');
  }
};

var submit = function(params) {
  // choose where to run the query
  var query = queryFunction(params.runwhere);

  // add location if proximity sorting
  if ( params.sort === 'near' ) {
    // false until we start testing geolocation
    $.extend(params, location(false));
  }

  query(params, {
    success: function(result) {
      dumpToDOM(result);
    }, error: function(err) {
      console.error(err);
    }
  });
};

var Query = {
  location: location,
  submit: submit
};

module.exports = Query;
