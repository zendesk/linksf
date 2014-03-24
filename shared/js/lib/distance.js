

function calculateDistance(facility, currentLocation, callback) {
  var pos = new google.maps.LatLng(facility.location.latitude, facility.location.longitude);
  currentLocation = new google.maps.LatLng(currentLocation.lat, currentLocation.lon);

  function getDistanceMatrixCallback(response, status) {
    response = (status === 'OK') ? response.rows[0].elements[0] : {};
    callback(response, facility);
  }
  fetchDistanceAndDuration([currentLocation], [pos], getDistanceMatrixCallback);
}

function calculateAllDistances(list, currentLocation, callback) {
  var destinations = [],
      origins = [ new google.maps.LatLng(currentLocation.lat, currentLocation.lon) ],
      locationHash = {};

  list.forEach(function(jsonModel) {
    var pos = new google.maps.LatLng(jsonModel.attributes.location.latitude, jsonModel.attributes.location.longitude);
    destinations.push(pos);
  });

  function getDistanceMatrixCallback(response, status) {
    response = (status === 'OK') ? response.rows[0].elements : {};
    callback(response, list);
  }
  fetchDistanceAndDuration(origins, destinations, getDistanceMatrixCallback);
}

function fetchDistanceAndDuration(origins, destinations, callback) {
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: origins,
      destinations: destinations,
      travelMode: google.maps.TravelMode.WALKING,
      durationInTraffic: true,
      avoidHighways: true,
      avoidTolls: false,
      unitSystem: google.maps.UnitSystem.IMPERIAL
    }, callback );
}

module.exports = {
  calculateAllDistances:            calculateAllDistances,
  calculateDistance:                calculateDistance
};
