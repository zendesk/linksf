import 'whatwg-fetch'
import camelize from 'camelize'

const LOCATIONS     = 'locations'
const ORGANIZATIONS = 'organizations'
const TAXONOMIES    = 'taxonomies'
const PHONES        = 'phones'

const SLASH         = '/'
const FORMAT        = '.json'

export const config = {
  apiKey: "AIzaSyCr7KlhsN-On4LrXTKkRdU-Df0s-WCR-TU",
  authDomain: "vivid-inferno-4672.firebaseapp.com",
  databaseURL: "https://vivid-inferno-4672.firebaseio.com",
  storageBucket: "vivid-inferno-4672.appspot.com",
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
        locations[locationId]
      ))
    })
}

export function fetchLocation(id) {
  const url = [
    config.databaseURL,
    LOCATIONS,
    id
  ].join(SLASH).concat(FORMAT)

  fetch(url).then(response => response.json())
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
        organizations[orgId]
      ))
    })
}

export function fetchOrganization(id) {
  const url = [
    config.databaseURL,
    ORGANIZATIONS,
    id
  ].join(SLASH).concat(FORMAT)

  return fetch(url).then(response => response.json())
}
