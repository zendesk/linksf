import Firebase from 'firebase'

const PAGINATION_VAL = 9 //firebase is inclusive so 0-9 includes 10 vals
const LOCATIONS     = 'locations'
const ORGANIZATIONS = 'organizations'
const TAXONOMIES    = 'taxonomies'
const PHONES        = 'phones'
const ONCE_VALUE    = 'value'

const firebase = new Firebase('https://vivid-inferno-4672.firebaseio.com')

export function fetchLocations(index = 0) {
  const startIndex = index.toString()
  const endIndex = (index + PAGINATION_VAL).toString()

  return firebase
    .child(LOCATIONS)
    .orderByKey()
    .startAt(startIndex)
    .endAt(endIndex)
    .once(ONCE_VALUE)
    .then(locationsResponse => (locationsResponse.val()))
}

export function fetchLocation(id) {
  return firebase
    .child(`${LOCATIONS}/${id}`)
    .once(ONCE_VALUE)
    .then(locationResponse => (locationResponse.val()))
}

// Fetches an organization with its services. Returns a Promise
export function fetchOrganization(locationId, orgId) {
  let organizationOut

  return firebase
    .child(ORGANIZATIONS)
    .orderByChild('id')
    .equalTo(orgId)
    .once(ONCE_VALUE)
    .then((orgRes) => {
      const maybeOrg = orgRes.val()
      const organization = maybeOrg[locationId]
      organizationOut = organization
      return firebase.child(`${PHONES}/${locationId}`).once(ONCE_VALUE)
    })
    .then((phonesResponse) => {
      organizationOut.phones = phonesResponse.val()
      return organizationOut
    })
}

// Fetchs all available categories
export function fetchCategories() {
  return firebase
    .child(TAXONOMIES)
    .once(ONCE_VALUE)
    .then((res) => (res.val()))
}
