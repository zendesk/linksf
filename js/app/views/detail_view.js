/*globals window, document*/

var Backbone                         = require('backbone'),
    Features                         = require('lib/features'),
    $                                = require('jquery'),
    _                                = require('underscore'),
    Hours                            = require('models/hours'),
    gmaps                            = require('google-maps'),
    fetchLocation                    = require('cloud/lib/fetch_location'),
    calculateDistanceFromService     = require('lib/distance').calculateDistanceFromService,
    calculateWalkingTimeFromDistance = require('lib/distance').calculateWalkingTimeFromDistance;

function extractDistanceTime(location, currentLocation) {
  var destination = {};
  if (location && currentLocation) {
    destination.distance     = calculateDistanceFromService(location, currentLocation);
    destination.walkingTime  = calculateWalkingTimeFromDistance(destination.distance);
    destination.showDistance = destination.showWalkingTime = true;
  }
  return destination;
}

var DetailView = Backbone.View.extend({
  template: require('templates/detail'),

  events: {
    'render.done':             'setMap',
    'click .inset-directions': 'launchDirections',
    'click .inset-gmap':       'launchDirections'
  },

  render: function() {
    var facility = this.model,
        $mapdiv  =  this.$('#detail-gmap');

    facility.destination = extractDistanceTime(facility.location, this.options.currentLocation);

    this.$el.html(this.template({
      facility:    facility,
      isMobile:    Features.isMobile(),
      navButtons: [
        { 'class': 'left', id: 'backNav-button', text: 'Back' }
      ]
    }));

    this.$('#backNav-button').click(function(){
      require('routers/router').instance.back();
    });

    _.defer(
      function(view) { view.setMap(); },
      this
    );

    return this;
  },

  launchDirections: function() {
    var isMobile = Features.isMobile(),
        dAddr = encodeURIComponent(
          this.model.address + '@' +
          this.model.location.latitude + ',' +
          this.model.location.longitude
        ),
        directionsUrl;

    if ( isMobile ) {
      directionsUrl = 'comgooglemaps://?daddr=' + dAddr;
      document.location = directionsUrl;
    } else {
      fetchLocation().done(function(loc) {
        var sAddr = '@' + loc.lat + ',' + loc.lon;
        directionsUrl = 'https://maps.google.com?daddr=' + dAddr + '&saddr=' + sAddr;
      }).fail(function() {
        directionsUrl = 'https://maps.google.com?daddr=' + dAddr;
      });
      window.open(directionsUrl, '_blank');
    }

    return false;
  },

  setMap: function(){
    var location, mapOptions, map;

    if ( !this.$('#detail-gmap') ) return;

    location = new gmaps.LatLng(
      this.model.location.latitude,
      this.model.location.longitude
    );

    mapOptions = {
      center:            location,
      zoom:              15,
      mapTypeId:         gmaps.MapTypeId.ROADMAP,
      mapTypeControl:    false,
      scrollwheel:       false,
      navigationControl: false,
      draggable:         false,
      streetViewControl: false,
      zoomControl:       false
    };

    map = new gmaps.Map(
      this.$('#detail-gmap')[0],
      mapOptions
    );

    fetchLocation().done(function(current) {
      var directionsService = new gmaps.DirectionsService(),
          directionsDisplay = new gmaps.DirectionsRenderer(),
          request;

      request = {
        origin:      new gmaps.LatLng(current.lat, current.lon),
        destination: location,
        travelMode:  gmaps.DirectionsTravelMode.WALKING
      };

      directionsDisplay.setMap(map);

      directionsService.route(request, function(response, status) {
        if (status == gmaps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
      });

    }).fail(function() {
      new gmaps.Marker({
        map:       map,
        position:  location,
        draggable: false
      });
    });
  }
});

module.exports = DetailView;
