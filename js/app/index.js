var $ = require('jquery');
var _ = require('underscore');

$(function() {
 var Parse    = require('parse'),
     Backbone = require('backbone'),
     _        = require('underscore'),
     gmaps    = require('google-maps');

  Parse.initialize("Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8", "kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls");

  var AppView = Backbone.View.extend({
    el: $("#linksf")
  });

  function submitToParse(params) { 
    Parse.Cloud.run("browse", params, {
      success: function(result) { 
        $('#results').empty();
        _.each(result, function(fac) { 
          $('#results').append(JSON.stringify(fac, null, '  '));
          $('#results').append("\n");
        });
      }, error: function(err) {
        $('#results').html(err);
      }
    });
  }

  $('#testSearch').click(function() {
    var params = {};
    params.sort = $('#near').val();
    if ( params.sort == 'near' ) { 
      if ( false && navigator.geolocation ) {
          navigator.geolocation.getCurrentPosition(function(position) {
            params.lat = position.coords.latitude;
            params.lon = position.coords.longitude;
            submitToParse(params);
          }, function(error) { 
            console.log(error);
          });
      } else {
          // for local development
          params.lat = 37.782355;
          params.lon = -122.409825;
          submitToParse(params);
      }
    } else {
      submitToParse(params);
    }

    return false;
  });

  var App = new AppView();
});
