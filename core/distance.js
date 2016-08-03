import Promise from 'bluebird'

function noErrPromisifier(originalMethod) {
  return () => {
    const args = [].slice.call(arguments)
    const self = this
    return new Promise((resolve) => {
      args.push(resolve)
      console.log(originalMethod)
      originalMethod.apply(self, args)
    })
  }
}

function fetchDistanceAndDuration(origins, destinations) {
  const googleService = new google.maps.DistanceMatrixService()
  const promiseGoogleService = Promise.promisifyAll(googleService.getDistanceMatrix, { promisifier: noErrPromisifier })
  return promiseGoogleService({
    origins,
    destinations: destinations.slice(0, 10),
    travelMode: google.maps.TravelMode.WALKING,
    durationInTraffic: true,
    avoidHighways: true,
    avoidTolls: false,
    unitSystem: google.maps.UnitSystem.IMPERIAL,
  })
}

function getResponseData(response, status) {
  const responseData = (status === 'OK') ? response.rows[0].elements : {}
  // console.log(response)
  // console.log(responseData)
  return responseData
}

export function calculateDistance(location, currentLocation) {
  const pos = new google.maps.LatLng(location.latitude, location.longitude)
  const { latitude, longitude } = currentLocation.coords
  const googleLocation = new google.maps.LatLng(latitude, longitude)
  console.log('asdkjlfnlakjsdf')
  console.log(latitude)
  console.log(longitude)

  return fetchDistanceAndDuration([googleLocation], [pos])
}

export function calculateAllDistances(locations, currentLocation) {
  const { latitude, longitude } = currentLocation.coords
  const googleLocation = new google.maps.LatLng(latitude, longitude)
  const origins = []

  const destinations = locations.map(location => (
    new google.maps.LatLng(
      location.latitude,
      location.longitude
    )))

  return fetchDistanceAndDuration(origins, destinations)
}
