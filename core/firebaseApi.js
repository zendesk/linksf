import Firebase from 'firebase'

const ref = new Firebase('https://vivid-inferno-4672.firebaseio.com')

export function fetchLocations() {
  return ref.child('locations/').once('value').then(locationsResponse => (
    locationsResponse.val()
  ))
}

export function fetchLocation(id) {
  return ref.child(`locations/${id}`).once('value').then(locationResponse => (
    locationResponse.val()
  ))
}

// Fetches an organization with its services. Returns a Promise
export function fetchOrganization(locationId, orgId) {
  let organizationOut
  return ref.child('organizations').orderByChild('id').equalTo(orgId)
                                                      .once('value')
    .then((orgRes) => {
      const maybeOrg = orgRes.val()
      const organization = maybeOrg[locationId]
      organizationOut = organization
      return ref.child(`phones/${locationId}`).once('value')
    })
    .then((phonesResponse) => {
      organizationOut.phones = phonesResponse.val()
      return organizationOut
    })
}

// Fetchs all available categories
export function fetchCategories() {
  return ref.child('taxonomies').once('value').then((res) => (
    res.val()
  ))
}
