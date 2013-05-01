var $        = require('jquery'),
    _        = require('underscore'),
    Facility = require('cloud/models/facility');

var location = function() {
  var lat, lon;

  if ( navigator.geolocation ) {
    navigator.geolocation.getCurrentPosition(function(position) {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
    }, function(error) {
      console.log(error);
    });
  }

  if (!(lat && lon)) {
    lat = 37.782355;
    lon = -122.409825;
  }

  return {lat: lat, lon: lon};
};

var queryFunction = function(runWhere) {
  if ( runWhere === 'cloud' ) {
    return _.partial(Parse.Cloud.run, "browse");
  } else {
    return require('cloud/lib/browse');
  }
};

var submit = function(params) {
  // to keep track of when it finishes
  var deferred = $.Deferred();

  // choose where to run the query
  // var query = queryFunction(params.runwhere);
  var query = queryFunction('browser');

  // add location if proximity sorting
  if ( params.sort === 'near' ) {
    $.extend(params, location());
  }

  query(params, {
    success: function(result) {
      deferred.resolve(result);
      // dumpToDOM(result);
    },

    error: function(err) {
      deferred.reject(err);
    }
  });

  return deferred.promise();
};

// TODO -- hoist this up a layer into "browse" -- or wherever we keep the direct parse communication lib. 
var getByID = function(id) { 
  var deferred = $.Deferred();

  var q = new Parse.Query(Facility);
  q.include("services");
  q.get(id, {
    success: function(result) { 
      deferred.resolve(result);
    },
    error: function(err) {
      deferred.reject(err);
    }
  });

  return deferred.promise();
};

module.exports = { submit: submit, getByID: getByID };
