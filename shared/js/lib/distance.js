var computeDistanceBetween = google.maps.geometry.spherical.computeDistanceBetween,
    LatLng = google.maps.LatLng;

function calculateDistanceFromService(location, currentLocation) {
  var pos1     = new LatLng(currentLocation.lat, currentLocation.lon),
      pos2     = new LatLng(location.latitude, location.longitude),
      distance = computeDistanceBetween(pos1, pos2);
  distance = distance/621.37; // meters to miles: distance / 1000 * 0.62137
  distance = +distance.toFixed(2); // precision after decimal point
  return distance;
}

function calculateWalkingTimeFromDistance(distance) {
  // 2.80 mph - older individuals average walking speed (wikipedia)
  return Math.ceil(distance*24.0); // 60 * distance / 2.5
}

module.exports = {
  calculateDistanceFromService:     calculateDistanceFromService,
  calculateWalkingTimeFromDistance: calculateWalkingTimeFromDistance
};
