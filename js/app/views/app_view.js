var Backbone = require('backbone'),
    $ = require('jquery'),
    _        = require('underscore'),
    browse   = require('lib/browse'),
    Modernizr = require('modernizr');

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
  onSubmit: function() {
    var params = $('#query').serializeObject();
    if ( params.sort == 'near' ) {
      var location = require('lib/query').location(false);
      $.extend(params, location);
    }

    submitToParse(params);
    return false;
  },
  render: function() {
    $(this.el).html(this.template());
    $('#query').submit(this.onSubmit);
    return this;
  }
});

module.exports = AppView;
