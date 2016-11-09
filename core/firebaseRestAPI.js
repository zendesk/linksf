import 'whatwg-fetch'
import camelize from 'camelize'

import firebase from 'firebase'
import { currentUser } from '../lib/session'
import config from '../config'

import R from 'ramda'

const LOCATIONS     = 'locations'
const ORGANIZATIONS = 'organizations'
const TAXONOMIES    = 'taxonomies'
const PHONES        = 'phones'

const SLASH         = '/'
const FORMAT        = '.json'

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

export function fetchLocations() {
  const url = [
    config.firebaseDatabaseUrl,
    LOCATIONS
  ].join(SLASH).concat(FORMAT)

  return fetch(url)
    .then(response => response.json())
    .then(locations => (
      Object.keys(locations).map(locationId => (
        R.merge({ services: {}, duration: {} }, camelize(locations[locationId]))
      ))
    ))
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
      body: JSON.stringify(location)
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
      body: JSON.stringify(organization)
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
