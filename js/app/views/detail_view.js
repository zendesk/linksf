var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),
	gmaps = require('google-maps');

var DetailView = Backbone.View.extend({
  el: $("#linksf"),
  template: require('templates/detail'),
  events: {
	"render.done": 'setMap'
  },
  render: function() {
	var facility = this.model;
	var $mapdiv =  this.$('#location-map');


    $(this.el).html(this.template({facility: facility}));
	_.defer( function( view ){ view.setMap();}, this );
    return this;
  },
  setMap: function(){
	if(this.$('#location-map')) {
		var location = new gmaps.LatLng(
			37.7421083,
			-122.4251428
			// probably gonna use a data attr to pass this back here
			// $map.data('latitude'),
			// $map.data('longitude')
		),
		mapOptions = {
			center: location,
			zoom: 15,
			mapTypeId: gmaps.MapTypeId.ROADMAP,
			scrollwheel: false,
			streetViewControl: false,
			zoomControlOptions: {
			style: gmaps.ZoomControlStyle.SMALL
		}

	},
	map = new gmaps.Map(this.$('#location-map')[0], mapOptions);

	new gmaps.Marker({
		map: map,
		position: location,
		draggable: false
		});
	}
  }
});

module.exports = DetailView;
