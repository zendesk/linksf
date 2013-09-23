/*globals window, document*/

var Backbone = require('backbone'),
    Features = require('lib/features'),
    $        = require('jquery'),
    _        = require('underscore'),
    Hours    = require('models/hours'),
    gmaps    = require('google-maps');

var aggregateOpenHours = function(facility) {
  var mergedHours = Hours.merge.apply(
    Hours,
    facility.services.map(function(service) {
      return Hours.fromData(service.openHours);
    })
  );

  return mergedHours.humanizeCondensed();
};

var DetailView = Backbone.View.extend({
  template: require('templates/detail'),

  events: {
    'render.done':             'setMap',
    'click .inset-directions': 'launchDirections',
    'click .inset-gmap':       'launchDirections'
  },

  render: function() {
    var facility = this.model,
        $mapdiv =  this.$('#detail-gmap');

    facility.openHours = aggregateOpenHours(facility);

    this.$el.html(this.template({
      facility: facility,
      isMobile: Features.isMobile(),
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
        baseGoogleMapsUrl = isMobile ? 'comgooglemaps://' : 'https://maps.google.com',
        dAddr = encodeURIComponent(
          this.model.address + '@' +
          this.model.location.latitude + ',' +
          this.model.location.longitude
        ),
        directionsUrl = baseGoogleMapsUrl + '?daddr=' + dAddr;

    if ( isMobile ) {
      document.location = directionsUrl;
    } else {
      window.open(directionsUrl, '_blank');
    }

    return false;
  },

  setMap: function(){
    if(this.$('#detail-gmap')) {
      var location = new gmaps.LatLng(this.model.location.latitude,
                                      this.model.location.longitude);
      var mapOptions = {
            center: location,
            zoom: 15,
            mapTypeId: gmaps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            scrollwheel: false,
            navigationControl: false,
            draggable: false,
            streetViewControl: false,
            zoomControl: false
          };
      var map = new gmaps.Map(this.$('#detail-gmap')[0], mapOptions);

      new gmaps.Marker({map: map,
                        position: location,
                        draggable: false});
      }
  }
});

module.exports = DetailView;
