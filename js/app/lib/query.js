var location = function(hasGeolocation) {
  var lat, lon;

  if ( hasGeolocation ) {
    navigator.geolocation.getCurrentPosition(function(position) {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
    }, function(error) {
      console.log(error);
    });
  } else {
    // for local development
    lat = 37.782355;
    lon = -122.409825;
  }

  return {lat: lat, lon: lon};
};

var Query = {
  location: location
};

module.exports = Query;
