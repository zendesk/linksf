var $ = require('jquery'),
    maps = require('google-maps'),
    Geocoder = maps.Geocoder,
    geocoder;

function fetchCurrentLocation(deferred) {
  if ( navigator.geolocation ) {
    navigator.geolocation.getCurrentPosition(function(position) {
      deferred.resolve({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      });
    }, function(error) {
      deferred.reject();
    });
  } else {
    deferred.reject();
  }
}

function fetchLocationForAddress(address, deferred) {
  if(!geocoder) {
    geocoder = new Geocoder();
  }

  geocoder.geocode({
    address: address
  }, function(results, status) {
    console.log(status, results);
    if (status == maps.GeocoderStatus.OK) {
      var location = results[0].geometry.location,
          lat      = location.lat(),
          lon      = location.lng();
      deferred.resolve({lat: lat, lon: lon});
    } else {
      deferred.reject();
    }
  });
}

module.exports = function(address) {
  var deferred = $.Deferred();
  if(address) {
    fetchLocationForAddress(address, deferred);
  } else {
    fetchCurrentLocation(deferred);
  }

  return deferred.promise();
};
