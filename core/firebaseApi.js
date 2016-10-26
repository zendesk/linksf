import firebase from 'firebase'
import globalConfig from '../config'

const LOCATIONS     = 'locations'
const ORGANIZATIONS = 'organizations'
const TAXONOMIES    = 'taxonomies'
const PHONES        = 'phones'
const ONCE_VALUE    = 'value'
import R from 'ramda'

export function firebaseClient() {
  if (firebase.apps.length === 1) {
    return firebase // Don't initialize more than one client
  }

  const config = {
    apiKey: globalConfig.firebaseApiKey,
    authDomain: globalConfig.firebaseAuthDomain,
  }

  firebase.initializeApp(config)

  return firebase
}

export function fetchOrganizations() {
  return firebaseClient()
    .database()
    .ref(ORGANIZATIONS)
    .orderByKey()
    .once(ONCE_VALUE)
    .then(organizationsResponse => {
      const data = organizationsResponse.val()
      return Object.keys(data).map((val) => {
        const org = data[val]
        org.key = val
        return org
      })
    })
}

// Fetches an organization with its services. Returns a Promise
export function fetchOrganization(orgId) {
  return firebaseClient()
    .database()
    .ref(ORGANIZATIONS)
    .orderByChild('id')
    .equalTo(orgId)
    .once(ONCE_VALUE)
    .then(orgResponse => {
      const data = orgResponse.val()
      const index = Object.keys(data)[0]
      return orgResponse.val()[index]
    })
}

export function putOrganization(organization) {
  var orgKey = organization.key
  if (!orgKey) {
    orgKey = firebaseClient().database().ref().child(ORGANIZATIONS).push().key
  }

  var update = {}
  update['/' + ORGANIZATIONS + '/' + orgKey] = organization

  firebaseClient().database().ref().update(update)
  return orgKey
}

export function fetchLocations() {
  return firebaseClient()
    .database()
    .ref(LOCATIONS)
    .orderByKey()
    .once(ONCE_VALUE)
    .then(locationsResponse => {
      const data = locationsResponse.val()
      return Object.keys(data).map(function(val) {
        var loc = data[val]
        loc.key = val
        console.log(loc)
        // const withDefaults = R.merge({ services: {}, duration: {} }, loc)
        // console.log(withDefaults)
        return loc
      })
    })
}

export function fetchLocation(id) {
  return firebaseClient()
    .database()
    .ref(`${LOCATIONS}/${id}`)
    .once(ONCE_VALUE)
    .then(locationResponse => locationResponse.val())
}

export function putLocation(location) {
  var locKey = location.key
  if (!locKey) {
    locKey = firebaseClient().database().ref().child(LOCATIONS).push().key
  }

  var update = {}
  update['/' + LOCATIONS + '/' + locKey] = location

  firebaseClient().database().ref().update(update)
  return locKey
}

export function fetchLocationsForOrganization(orgId) {
  return firebaseClient()
    .database()
    .ref(LOCATIONS)
    .orderByChild('organization_id')
    .equalTo(orgId)
    .once(ONCE_VALUE)
    .then(locationsResponse => {
      const data = locationsResponse.val()
      return Object.keys(data).map(function(val) {
        var loc = data[val]
        loc.key = val
        return loc
      })
    })
}

// Fetchs all available categories
export function fetchTaxonomies() {
  return firebaseClient()
    .database()
    .ref(TAXONOMIES)
    .once(ONCE_VALUE)
    .then(res => res.val())
}
