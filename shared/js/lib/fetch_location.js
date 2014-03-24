var cachedPosition = null;

function fetchCurrentLocation(deferred) {
  if ( cachedPosition ) {
    return deferred.resolve(cachedPosition);
  }
  if ( navigator.geolocation ) {
    navigator.geolocation.getCurrentPosition(function(position) {
      cachedPosition = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };

      deferred.resolve(cachedPosition);
    }, function(error) {
      deferred.reject(error);
    },
    { maximumAge:60000, timeout:5000, enableHighAccuracy:true });
  } else {
    deferred.reject();
  }
}

var geocoder;

function fetchLocationForAddress(address, deferred) {
  var maps = google.maps,
      Geocoder = maps.Geocoder;

  if(!geocoder) {
    geocoder = new Geocoder();
  }

  geocoder.geocode({
    address: address
  }, function(results, status) {
    console.log(status, results);
    if (status === maps.GeocoderStatus.OK) {
      var location  = results[0].geometry.location,
          formatted = results[0].formatted_address,
          lat       = location.lat(),
          lon       = location.lng();
      deferred.resolve({lat: lat, lon: lon, formattedAddress: formatted});
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
