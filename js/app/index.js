var $ = require('jquery');

$(function() {
 var Parse    = require('parse'),
     Backbone = require('backbone'),
     _        = require('underscore'),
     gmaps    = require('google-maps'), 
     browse   = require('lib/browse');
  
  require('jquery-serialize-object');

  Parse.initialize("Z2l0Zn6NGrHCDoBPKUeD7Tf1fAUDaazQihQFqnL8", "kGPp7cydleuFbhKB4mrviTmbIjrbTjhxGP4dP7Ls");

  var AppView = Backbone.View.extend({
    el: $("#linksf")
  });

  function submitToParse(params) { 
    var browseFunction;

    if ( params.runwhere === 'cloud' ) {
      browseFunction = _.partial(Parse.Cloud.run, "browse");
    } else {
      browseFunction = browse;
    }

    browseFunction(params, {
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

  $('#query').submit(function() {
    var params = $('#query').serializeObject();
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
