var Features                         = require('lib/features'),
    Hours                            = require('shared/models/hours'),
    fetchLocation                    = require('shared/lib/fetch_location'),
    calculateDistanceFromService     = require('shared/lib/distance').calculateDistanceFromService,
    calculateWalkingTimeFromDistance = require('shared/lib/distance').calculateWalkingTimeFromDistance;

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

  navButtons: [
    { 'class': 'left', id: 'backNav-button', text: 'Back' }
  ],

  render: function() {
    var facility = this.model,
        $mapdiv  =  this.$('#detail-gmap');

    facility.destination = extractDistanceTime(facility.location, this.options.currentLocation);

    this.$el.html(this.template({
      facility:    facility,
      isMobile:    Features.isMobile()
    }));

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

    location = new google.maps.LatLng(
      this.model.location.latitude,
      this.model.location.longitude
    );

    mapOptions = {
      center:            location,
      zoom:              15,
      mapTypeId:         google.maps.MapTypeId.ROADMAP,
      mapTypeControl:    false,
      scrollwheel:       false,
      navigationControl: false,
      draggable:         false,
      streetViewControl: false,
      zoomControl:       false
    };

    map = new google.maps.Map(
      this.$('#detail-gmap')[0],
      mapOptions
    );

    fetchLocation().done(function(current) {
      var directionsService = new google.maps.DirectionsService(),
          directionsDisplay = new google.maps.DirectionsRenderer(),
          request;

      request = {
        origin:      new google.maps.LatLng(current.lat, current.lon),
        destination: location,
        travelMode:  google.maps.DirectionsTravelMode.WALKING
      };

      directionsDisplay.setMap(map);

      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
      });

    }).fail(function() {
      new google.maps.Marker({
        map:       map,
        position:  location,
        draggable: false
      });
    });
  }
});

module.exports = DetailView;
