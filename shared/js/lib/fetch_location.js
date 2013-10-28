var maps = google.maps,
    Geocoder = maps.Geocoder,
    geocoder;

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
