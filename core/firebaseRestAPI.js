import 'whatwg-fetch'
import camelize from 'camelize'

import config from '../config'

const LOCATIONS     = 'locations'
const ORGANIZATIONS = 'organizations'
const TAXONOMIES    = 'taxonomies'
const PHONES        = 'phones'

const SLASH         = '/'
const FORMAT        = '.json'


export function fetchTaxonomies() {
  const url = [
    config.firebaseDatabaseUrl,
    TAXONOMIES
  ].join(SLASH).concat(FORMAT)

  return fetch(url).then(response => response.json())
}

export function fetchLocations() {
  const url = [
    config.firebaseDatabaseUrl,
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
    config.firebaseDatabaseUrl,
    LOCATIONS,
    id
  ].join(SLASH).concat(FORMAT)

  return fetch(url)
    .then(response => response.json())
    .then(json => camelize(json))
}

export function fetchOrganizations() {
  const url = [
    config.firebaseDatabaseUrl,
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
    config.firebaseDatabaseUrl,
    ORGANIZATIONS,
    id
  ].join(SLASH).concat(FORMAT)

  return fetch(url)
    .then(response => response.json())
    .then(json => camelize(json))
}
