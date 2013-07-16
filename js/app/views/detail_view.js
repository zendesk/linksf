/*globals window, document */

var Backbone      = require('backbone'),
    Features      = require('lib/features'),
    $             = require('jquery'),
    _             = require('underscore'),
    gmaps         = require('google-maps'),
    fetchLocation = require('cloud/lib/fetch_location');

var DetailView = Backbone.View.extend({
  template: require('templates/detail'),
  events: {
    "render.done": 'setMap',
    "click .directions": 'launchDirections'
  },

  render: function() {
    var facility = this.model;
    var $mapdiv =  this.$('#location-map');

    this.$el.html(this.template({
      facility: facility,
      isMobile: Features.isMobile(),
      navButtons: [{class: 'results', text: 'Results'}]
    }));
    _.defer( function( view ){ view.setMap();}, this );

    return this;
  },

  launchDirections: function() {
    var urlBase = Features.isMobile() ? "comgooglemaps://?daddr=" : 'https://maps.google.com?daddr=',
        dAddr = encodeURIComponent(this.model.address +
                                   "@" +
                                   this.model.location.latitude +
                                   "," +
                                   this.model.location.longitude),
        url = urlBase + dAddr;

    document.location = url;
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
            navigationControl: false,
            draggable: false,
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
    $.each(this.$('.desco'), function() {
      if ($(this).text().length > 52) {
        $(this).text($(this).text().substr(0,52)+"...");
      }
    });

    this.$('.prevrow').last().remove();
    this.$('#backNav').click(function(){window.history.back();});

  }

});

module.exports = DetailView;
