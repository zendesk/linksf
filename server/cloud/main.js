var Facility = Parse.Object.extend("Facility");
var Service  = Parse.Object.extend("Service");

var _ = require('underscore');

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("browse", function(request, response) {
  var params = request.params;
  var sort = params.sort;
  var limit = params.limit || 10;
  var open = params.open;
  var demo = params.demo;
  var service = params.service;

  var q = new Parse.Query(Facility);

  if ( sort == 'near' ) {
    if ( !(params.lat && params.lon) ) {
      response.error("Please provide a lat and lon");
      return;
    }

    var geopoint = new Parse.GeoPoint(params.lat, params.lon);
    q.near('location', geopoint);
  } else {
    q.ascending('name');
  }

  q.limit(limit);

  var resp = [];
  q.find({
    success: function(rows) {
      _.each(rows, function(facility) { 
        resp.push(facility); 
      });
      response.success(rows);
    }, error: function(err) { 
      console.log(err);
    }
  });
});
