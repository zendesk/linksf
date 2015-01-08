var Features          = require('../lib/features'),
    Analytics         = require('../../../shared/js/lib/analytics'),
    Hours             = require('cloud/models/hours'),
    fetchLocation     = require('../../../shared/js/lib/fetch_location'),
    calculateDistance = require('../../../shared/js/lib/distance').calculateDistance;

function calculateDistanceCallback (walkingData, facility){
  if ( !walkingData ) return;

  var distanceSpan = this.$("#distance_" + facility.objectId),
      durationSpan = this.$("#duration_" + facility.objectId),
      distanceEls = walkingData.distance.text.split(" ");
  switch ( distanceEls[1] ) {
    case "mi":
      facility.distanceText = distanceEls[0] + " miles";
      break;
    case "ft":
      facility.distanceText = distanceEls[0] + " feet";
      break;
    default:
      facility.distanceText = walkingData.distance.text;
  }
  facility.durationText = Math.floor(walkingData.duration.value/60) + ' minutes walking';
  $(distanceSpan).text( facility.distanceText );
  $(durationSpan).text( facility.durationText );
}

function directionsUrl(facility, startingLocation) {
  var isMobile = Features.isMobile(),
      isIOS = Features.isIOS(),
      url;

  // pick the base Google Maps url
  if ( isIOS ) {
    url = 'comgooglemaps://?daddr=' + encodeURIComponent(
      facility.location.latitude + ',' +
      facility.location.longitude
    );
  } else {
    url = 'https://maps.google.com?daddr=' + encodeURIComponent(
      facility.address + '@' +
      facility.location.latitude + ',' +
      facility.location.longitude
    );
  }

  // add the starting location, if available
  if ( startingLocation ) {
    url += '&saddr=' + startingLocation.lat + ',' + startingLocation.lon;
  }

  return url;
}

var DetailView = Backbone.View.extend({
  template: require('../templates/detail.hbs'),

  events: {
    'render.done':             'setMap',
    'click .inset-directions': 'launchDirections',
    'click #link_gmap':        'launchDirections',
    'click .inset-call':       'trackCalling',
    'click .inset-website':    'trackClickingWebsite'
  },

  navButtons: [
    { 'class': 'left', id: 'backNav-button', text: '<i class="icon-left-open back"></i> BACK' }
  ],

  render: function() {
    var facility = this.model;
    if ( !facility.distanceData && this.options.currentLocation ) {
      calculateDistance(facility, this.options.currentLocation, calculateDistanceCallback );
    }

    this.$el.html(this.template({
      facility: facility,
      isMobile: Features.isMobile()
    }));

    _.defer(
      function(view) { view.setMap(); },
      this
    );

    return this;
  },

  trackCalling: function(event) {
    Analytics.trackDetailsAction('call', { location: this.options.currentLocation, externalLinkTarget: this.model.name });
  },

  trackClickingWebsite: function(event) {
    Analytics.trackDetailsAction('website', { location: this.options.currentLocation, externalLinkTarget: this.model.name });
  },

  launchDirections: function() {
    var isIOS    = Features.isIOS(),
        isMobile = Features.isMobile(),
        facility = this.model;

    Analytics.trackDetailsAction('directions', { location: this.options.currentLocation, externalLinkTarget: facility.name });

    if ( isIOS ) {
      document.location = directionsUrl(facility);
      return false;
    }

    fetchLocation().always(function(data) {
      var location = null,
          url;

      if ( data.lat && data.lon ) location = data;

      url = directionsUrl(facility, location);

      window.open(url, '_blank');
    });

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
        if (status === google.maps.DirectionsStatus.OK) {
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
