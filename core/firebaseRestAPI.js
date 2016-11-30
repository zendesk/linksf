import 'whatwg-fetch'
import camelize from 'camelize'
import decamelizeKeysDeep from 'decamelize-keys-deep'

import firebase from 'firebase'
import { currentUser } from '../lib/session'
import config from '../config'

import R from 'ramda'

const decamelize = decamelizeKeysDeep

const LOCATIONS     = 'locations'
const ORGANIZATIONS = 'organizations'
const TAXONOMIES    = 'taxonomies'
const PHONES        = 'phones'

const SLASH         = '/'
const FORMAT        = '.json'

const LOCATION_SCHEMA = {
  id: '',
  description: '',
  latitude: 0,
  longitude: 0,
  name: '',
  organizationId: '',
  services: {},
  physicalAddress: null,
  duration: null,
}

const SERVICE_SCHEMA =
  {
    id: '',
    locationId: '',
    name: '',
    applicationProcess: '',
    description: '',
    eligibility: null,
    organization: '',
    schedules: [],
    physicalAddress: null,
    taxonomy: '',
  }

function authToken() {
  return '?auth=' + currentUser().token
}

export function fetchTaxonomies() {
  const url = [
    config.firebaseDatabaseUrl,
    TAXONOMIES
  ].join(SLASH).concat(FORMAT)

  return fetch(url)
    .then(response => response.json())
    .then(json => Object.keys(json))
}

function ensureDefaultsForService(service) {
  return R.merge(SERVICE_SCHEMA, service)
}

function ensureDefaultsForLocation(location) {
  const defaultLocation =
    R.merge(LOCATION_SCHEMA, camelize(location))
  const defaultServices = defaultLocation.services
  if (defaultServices) {
    Object.keys(defaultServices).forEach(serviceId => {
      defaultServices[serviceId] = ensureDefaultsForService(defaultServices[serviceId])
    })
  }
  return R.merge(defaultLocation, { services: defaultServices })
}

function ensureDefaultsForLocations(locations) {
  return Object.keys(locations).map(locationId => (
    ensureDefaultsForLocation(locations[locationId])
  ))
}

function getQueryString(pageSize, startAt) {
  if (!pageSize && !startAt) {
    return ''
  }

  const queryString = ['orderBy="$key"']

  if (pageSize > 0) {
    queryString.push(`limitToFirst=${pageSize}`)
  }

  if (startAt) {
    queryString.push(`startAt="${startAt}"`)
  }

  return `?${queryString.join('&')}`
}

export function fetchLocations(pageSize, startAt) {
  const queryString = getQueryString(pageSize, startAt)

  const url = [
    config.firebaseDatabaseUrl,
    LOCATIONS,
  ].join(SLASH).concat(FORMAT).concat(queryString)

  return fetch(url)
    .then(response => response.json())
    .then(locations => ensureDefaultsForLocations(camelize(locations)))
}

export function fetchLocation(id) {
  const url = [
    config.firebaseDatabaseUrl,
    LOCATIONS,
    id
  ].join(SLASH).concat(FORMAT)

  return fetch(url)
    .then(response => response.json())
    .then(location => ensureDefaultsForLocation(camelize(location)))
}

export function updateLocation(location) {
  const url = [
    config.firebaseDatabaseUrl,
    LOCATIONS,
    location.id
  ].join(SLASH).concat(FORMAT).concat(authToken())

  return fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(decamelize(location))
    })
    .then(response => response.json())
    .then(json => camelize(json))
}

export function deleteLocation(id) {
  const url = [
    config.firebaseDatabaseUrl,
    LOCATIONS,
    id
  ].join(SLASH).concat(FORMAT)

  return fetch(url, {method: 'DELETE'})
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

export function updateOrganization(organization) {
  const url = [
    config.firebaseDatabaseUrl,
    ORGANIZATIONS,
    organization.id
  ].join(SLASH).concat(FORMAT).concat(authToken())

  return fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(decamelize(organization))
    })
    .then(response => response.json())
    .then(json => camelize(json))
}

export function deleteOrganization(id) {
  const url = [
    config.firebaseDatabaseUrl,
    ORGANIZATIONS,
    id
  ].join(SLASH).concat(FORMAT)

  return fetch(url, {method: 'DELETE'})
}

export function firebaseClient() {
  if (firebase.apps.length === 1) {
    return firebase // Don't initialize more than one client
  }

  const fbConfig = {
    apiKey: config.firebaseApiKey,
    authDomain: config.firebaseAuthDomain,
  }

  firebase.initializeApp(fbConfig)

  return firebase
}
