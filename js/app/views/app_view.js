var Backbone = require('backbone'),
    $ = require('jquery'),
    _        = require('underscore'),
    browse   = require('lib/browse');

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
      $('#results').append("results available at $('#results').data('results')\n\n");

      _.each(result, function(fac) {
        fac.set("services",
          _.map(fac.get('services'), function(s) { return s.attributes; } )
          );
        $('#results').append(JSON.stringify(fac, null, '  '));
        $('#results').append("\n");
      });
      $('#results').data('results', result);
    }, error: function(err) {
      $('#results').html(err);
    }
  });
}

var AppView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/query_form'),
  render: function() {
    $(this.el).html(this.template());
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
    return this;
  }
});

module.exports = AppView;
