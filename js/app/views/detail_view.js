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

			this.model.location.latitude,
			this.model.location.longitude
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
	this.layout();
	},
  layout: function(){
	$.each($('.desco'), function(){
		if($(this).text().length > 52){
			console.log("wtf");
			$(this).text($(this).text().substr(0,52)+"...");}
		});	
	$('.more').click(function(){$(this).parent().next($('.seeMore')).slideToggle();});
	}

});

module.exports = DetailView;
