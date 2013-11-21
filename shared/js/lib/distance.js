var maps = google.maps,
    LatLng = maps.LatLng;

function calculateDistanceFromService(location, currentLocation) {
  var pos1     = new LatLng(currentLocation.lat, currentLocation.lon),
      pos2     = new LatLng(location.latitude, location.longitude),
      distance = maps.geometry.spherical.computeDistanceBetween(pos1, pos2);
  distance = distance/1000*0.62137; // meters to miles
  distance = +distance.toFixed(2); // precision after decimal point
  return distance;
}

function calculateWalkingTimeFromDistance(distance) {
  // 2.80 mph - older individuals average walking speed (wikipedia)
  return Math.ceil(60*distance/2.5);
}

module.exports = {
  calculateDistanceFromService:     calculateDistanceFromService,
  calculateWalkingTimeFromDistance: calculateWalkingTimeFromDistance
};
