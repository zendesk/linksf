function fetchDistanceAndDuration(origins, destinations) {
  const googleService = new google.maps.DistanceMatrixService()
  // const promiseGoogleService = Promise.promisifyAll(, { promisifier: noErrPromisifier })
  const matrixParams = {
    origins,
    destinations: destinations.slice(0, 10),
    travelMode: google.maps.TravelMode.WALKING,
    durationInTraffic: true,
    avoidHighways: true,
    avoidTolls: false,
    unitSystem: google.maps.UnitSystem.IMPERIAL,
  }

  return new Promise(function(resolve, reject) {
        // Put all your code here, this section is throw-safe.
        googleService.getDistanceMatrix(matrixParams, function(response, status) {
          if (status == google.maps.DistanceMatrixStatus.OK) {
              resolve(response)
            }
          else {
              reject(status)
            }
        })
    })
}

export function calculateDistance(location, currentLocation) {
  const pos = new google.maps.LatLng(location.latitude, location.longitude)
  const { latitude, longitude } = currentLocation.coords
  const googleLocation = new google.maps.LatLng(latitude, longitude)

  return fetchDistanceAndDuration([googleLocation], [pos])
}

export function calculateAllDistances(locations, currentLocation) {
  const { latitude, longitude } = currentLocation.coords
  const origins = [new google.maps.LatLng(latitude, longitude)]

  const destinations = locations.map(location => (
    new google.maps.LatLng(
      location.latitude,
      location.longitude
    )))

  return fetchDistanceAndDuration(origins, destinations)
}
