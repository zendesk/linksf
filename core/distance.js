function fetchDistanceAndDuration(origins, destinations) {
  const googleService = new google.maps.DistanceMatrixService()
  return googleService.getDistanceMatrix(
    {
      origins,
      destinations,
      travelMode: google.maps.TravelMode.WALKING,
      durationInTraffic: true,
      avoidHighways: true,
      avoidTolls: false,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    })
}

function getResponseData(response, status) {
  const responseData = (status === 'OK') ? response.rows[0].elements : {}
  console.log(responseData)
  return responseData
}

export function calculateDistance(location, currentLocation) {
  const pos = new google.maps.LatLng(location.latitude, location.longitude)
  const googleLocation = new google.maps.LatLng(currentLocation.lat, currentLocation.lon)

  return fetchDistanceAndDuration([googleLocation], [pos])
    .then(getResponseData)
}

export function calculateAllDistances(locations, currentLocation) {
  const origins = [new google.maps.LatLng(currentLocation.lat, currentLocation.lon)]

  const destinations = locations.map(location => (
    new google.maps.LatLng(
      location.latitude,
      location.longitude
    )))

  return fetchDistanceAndDuration(origins, destinations)
    .then(getResponseData)
}
