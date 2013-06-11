/*globals alert*/
var $             = require('jquery'),
    _             = require('underscore'),
    Facility      = require('cloud/models/facility'),
    fetchLocation = require('cloud/lib/fetch_location');

var runWithLocation = function(callback) {
  fetchLocation()
    .done(function(loc) {
      callback(loc);
    })
    .fail(function() {
      callback({lat: 37.782355, lon:-122.409825});
    });
};

var queryFunction = function(runWhere) {
  return _.partial(Parse.Cloud.run, "browse");
};

var submit = function(params) {
  // to keep track of when it finishes
  var deferred = $.Deferred();

  // choose where to run the query
  // var query = queryFunction(params.runwhere);

  // add location if proximity sorting
  if ( params.sort === 'near' ) {
    runWithLocation(function(loc) {
      $.extend(params, loc);
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
