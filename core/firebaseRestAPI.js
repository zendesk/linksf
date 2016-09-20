import 'whatwg-fetch'
import camelize from 'camelize'

const LOCATIONS     = 'locations'
const ORGANIZATIONS = 'organizations'
const TAXONOMIES    = 'taxonomies'
const PHONES        = 'phones'

const SLASH         = '/'
const FORMAT        = '.json'

export const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  storageBucket: "",
}

export function fetchTaxonomies() {
  const url = [
    config.databaseURL,
    TAXONOMIES
  ].join(SLASH).concat(FORMAT)

  return fetch(url).then(response => response.json())
}

export function fetchLocations() {
  const url = [
    config.databaseURL,
    LOCATIONS
  ].join(SLASH).concat(FORMAT)

  return fetch(url)
    .then(response => response.json())
    .then(locations => {
      return Object.keys(locations).map(locationId => (
        camelize(locations[locationId])
      ))
    })
}

export function fetchLocation(id) {
  const url = [
    config.databaseURL,
    LOCATIONS,
    id
  ].join(SLASH).concat(FORMAT)

  return fetch(url)
    .then(response => response.json())
    .then(json => camelize(json))
}

export function fetchOrganizations() {
  const url = [
    config.databaseURL,
    ORGANIZATIONS
  ].join(SLASH).concat(FORMAT)

  return fetch(url)
    .then(response => response.json())
    .then(organizations => {
      return Object.keys(organizations).map(orgId => (
        camelize(organizations[orgId])
      ))
    })
}

export function fetchOrganization(id) {
  const url = [
    config.databaseURL,
    ORGANIZATIONS,
    id
  ].join(SLASH).concat(FORMAT)

  return fetch(url)
    .then(response => response.json())
    .then(json => camelize(json))
}
