/*globals alert*/
var $        = require('jquery'),
    _        = require('underscore'),
    Facility = require('cloud/models/facility');

var runWithLocation = function(callback) {
  if ( navigator.geolocation ) {
    navigator.geolocation.getCurrentPosition(function(position) {
      callback(position.coords.latitude,
               position.coords.longitude);
    }, function(error) {
      callback(37.782355, -122.409825);
    });
  }
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

  // add location if proximity sorting
  if ( params.sort === 'near' ) {
    runWithLocation(function(lat, lon) {
      $.extend(params, {lat: lat, lon: lon});
      performQuery(params, deferred);
    });
  } else {
    performQuery(params, deferred);
  }

  return deferred.promise();
};

var performQuery = function(params, deferred) {
  var query = queryFunction('browser');

  query(params, {
    success: function(result) {
      deferred.resolve(result);
      // dumpToDOM(result);
    },

    error: function(err) {
      deferred.reject(err);
    }
  });
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
