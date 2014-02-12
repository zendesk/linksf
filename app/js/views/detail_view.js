var Analytics                        = require('lib/analytics'),
    Features                         = require('lib/features'),
    Hours                            = require('shared/models/hours'),
    fetchLocation                    = require('shared/lib/fetch_location'),
    calculateDistance            = require('shared/lib/distance').calculateDistance;

function calculateDistanceCallback (walkingData, facility){
  var self = this;
    if (!walkingData) { return; }
    var distanceSpan = self.$("#distance_" + facility.objectId),
        durationSpan = self.$("#duration_" + facility.objectId);
    facility.distanceText = walkingData.distance.text;
    facility.durationText = walkingData.duration.text;
    $(distanceSpan).text( facility.distanceText );
    $(durationSpan).text( facility.durationText );
}

var DetailView = Backbone.View.extend({
  template: require('templates/detail'),

  events: {
    'render.done':             'setMap',
    'click .inset-directions': 'launchDirections',

    'click .inset-gmap':       'launchDirections',
    'click .inset-call':       'trackCalling',
    'click .inset-website':    'trackClickingWebsite'
  },

  navButtons: [
    { 'class': 'left', id: 'backNav-button', text: 'Back' }
  ],

  render: function() {
    var facility = this.model,
        $mapdiv  =  this.$('#detail-gmap');

    if ( !facility.distanceData && this.options.currentLocation ) {
      calculateDistance(facility, this.options.currentLocation, calculateDistanceCallback );
    }
    this.$el.html(this.template({
      facility:    facility,
      isMobile:    Features.isMobile()
    }));

    _.defer(
      function(view) { view.setMap();
    },
      this
    );


    return this;
  },


  trackCalling: function(event) {
    Analytics.trackDetailsAction('call');
    ga('send', 'event', 'external_link', 'call', this.model.name);
  },

  trackClickingWebsite: function(event) {
    Analytics.trackDetailsAction('website');
    ga('send', 'event', 'external_link', 'website', this.model.name);
  },

  launchDirections: function() {
    Analytics.trackDetailsAction('directions');
    ga('send', 'event', 'external_link', 'directions', this.model.name);
    var isAndroid22 = Features.isAndroid22(),
        isMobile = Features.isMobile(),
        dAddr = encodeURIComponent(
          this.model.address + '@' +
          this.model.location.latitude + ',' +
          this.model.location.longitude
        ),
        directionsUrl = '';

    if ( isMobile && !isAndroid22 ) {
      directionsUrl = 'comgooglemaps://?daddr=' + dAddr;
      document.location = directionsUrl;
    } else {
      fetchLocation().done(function(loc) {
        var sAddr = '@' + loc.lat + ',' + loc.lon;
        directionsUrl = 'https://maps.google.com?daddr=' + dAddr + '&saddr=' + sAddr;

      }).fail(function() {
        directionsUrl = 'https://maps.google.com?daddr=' + dAddr;
      });
      _.defer( function() {
        isAndroid22 ? (document.location = directionsUrl) : window.open(directionsUrl, '_blank');
      });
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
