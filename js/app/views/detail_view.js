/*globals window, document */

var Backbone      = require('backbone'),
    $             = require('jquery'),
    _             = require('underscore'),
    gmaps         = require('google-maps'),
    fetchLocation = require('cloud/lib/fetch_location');

var DetailView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/detail'),
  events: {
    "render.done": 'setMap',
    "click .directions": 'launchDirections'
  },

  render: function() {
    var facility = this.model;
    var $mapdiv =  this.$('#location-map');

    $(this.el).html(this.template({facility: facility}));
    _.defer( function( view ){ view.setMap();}, this );

    return this;
  },

  launchDirections: function() {
    var url = "comgooglemaps://?daddr=" +
              this.model.address +
              "@" +
              this.model.location.latitude +
              "," +
              this.model.location.longitude;
    
    fetchLocation()
      .done(function(loc) {
        url = url + "&saddr=" + loc.lat + "," + loc.lon;
        document.location = url;
      })
      .fail(function() {
        document.location = url;
      });
    return false;
  },

  setMap: function(){
    if(this.$('#location-map')) {
      var location = new gmaps.LatLng(this.model.location.latitude,
                                      this.model.location.longitude);
      var mapOptions = {
            center: location,
            zoom: 15,
            mapTypeId: gmaps.MapTypeId.ROADMAP,
            scrollwheel: false,
            streetViewControl: false,
            zoomControlOptions: {
              style: gmaps.ZoomControlStyle.SMALL
            }
          };
      var map = new gmaps.Map(this.$('#location-map')[0], mapOptions);

      new gmaps.Marker({map: map,
                        position: location,
                        draggable: false});
      }
      this.layout();
  },
  layout: function(){
  $.each($('.desco'), function(){
    if($(this).text().length > 52){
      $(this).text($(this).text().substr(0,52)+"...");}
    });
  $('.more').click(function(){$(this).parent().next($('.seeMore')).slideToggle();});
  $('.prevrow').last().remove();

  }

});

module.exports = DetailView;
