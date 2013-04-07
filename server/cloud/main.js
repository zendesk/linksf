var Facility = Parse.Object.extend("Facility");
var Service  = Parse.Object.extend("Service");

var _ = require('underscore');
var facilityBrowse = require('cloud/browse');

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("browse", function(request, response) {
  facilityBrowse(request.params, response);
});
