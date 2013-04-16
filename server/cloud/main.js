var _ = require('underscore');
var facilityBrowse = require('cloud/lib/browse');

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("browse", function(request, response) {
  facilityBrowse(request.params, response);
});
