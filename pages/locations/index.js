import React, { Component } from 'react'

import globalConfig from '../../config'

import { fetchLocations } from '../../core/firebaseRestAPI'
import { calculateAllDistances } from '../../core/distance'

import Layout from '../../components/Layout'
import Loading from '../../components/Loading'
import FilterBar from '../../components/FilterBar'
import LocationList from '../../components/LocationList'
import { filterByOptionsString } from '../../lib/filterLocations'
import R from 'ramda'

function getParameterByName(name) {
  const match = RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search)
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

// End result for locations is the same except with a duration attribute with a number in minutes
function mergeLocationsAndDistances(locations, matrixResponses) {
  const zip = (e, index) => {
    return [locations[index], matrixResponses[index]]
  }

  const merge = ([location, responseObj]) => {
    const locationAndDistance = location
    const durationInfo = responseObj || {}
    locationAndDistance.duration = durationInfo.duration // i hate this; it breaks the consistency of the whole app
    return locationAndDistance
  }

  return locations.map((e, i) => merge(zip(e, i)))
}

function calculateWalkingTime(locationA, currentLocation) {
  // Approxmiate miles per degree at 38 degrees North
  const degreeLatDistance = 69
  const degreeLongDistance = 54.6

  const deltaLat = ( (locationA.latitude * currentLocation.coords.latitude) < 0 ) ? 
    Math.abs(Math.abs(locationA.latitude) + Math.abs(currentLocation.coords.latitude)) :
    Math.abs(Math.abs(locationA.latitude) - Math.abs(currentLocation.coords.latitude))

  const deltaLong = ( (locationA.longitude * currentLocation.coords.longitude) < 0 ) ? 
    Math.abs(Math.abs(locationA.longitude) + Math.abs(currentLocation.coords.longitude)) :
    Math.abs(Math.abs(locationA.longitude) - Math.abs(currentLocation.coords.longitude))
  
  // 20 is 60 (minutes in an hour) / 3 mph (average walking pace) to convert distance to walk time in minutes
  return Math.round((deltaLat * degreeLatDistance + deltaLong * degreeLongDistance) * 20)
}

export default class LocationsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      locations: null,
      locationsWithDistance: [],
      currentLocation: null,
    }
  }

  componentDidMount() {
    document.title = globalConfig.title

    fetchLocations(20)
      .then(locations => {
        this.setState({ locations }, this.loadRemaining)
      })
  }

  setCurrentLocation = () => {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(currentLocation => {
        this.setState({ currentLocation }, this.addDistances)
      })
    }
  }

  addDistances = () => {
    const { currentLocation, locations, locationsWithDistance } = this.state
    const locationSlices = R.splitEvery(25, locations)

    if (!currentLocation) return

    this.calculateDistances(locationsWithDistance, locationSlices, currentLocation)
  }

  calculateDistances = (locationsWithDistance, locationSlices, currentLocation) => {
    const a = R.splitAt(1, locationSlices)
    const locations = a[0][0] // this will always only have one element, the array of our working locations
    const remaining = a[1]

    if (locations) {
      // we can only call the distance matrix API with 25 elements at a time,
      // and 100 elements per second, so lets call with 25 elements every 250ms
      setTimeout(_ => {
        calculateAllDistances(locations, currentLocation)
          .then(matrixResponse => {
            const matrixResponses = matrixResponse.rows[0].elements
            const updatedLocations = mergeLocationsAndDistances(locations, matrixResponses)

            this.calculateDistances([...locationsWithDistance, ...updatedLocations], remaining, currentLocation)
          }).catch(this.calculateDistancesFallback)
      }, 250)
    } else {
      this.setState({ locations: locationsWithDistance })
    }
  }

  calculateDistancesFallback = () => {
    const { currentLocation, locations } = this.state
    const locationsWithDuration = locations

    const addDuration = (location) => {
      const locationWithDuration = location
      const walkingTime = calculateWalkingTime(location, currentLocation)
      locationWithDuration.duration = { 
        value: walkingTime,
        text: `${walkingTime} mins`
      }
      return locationWithDuration
    }

    this.setState({ locations: locationsWithDuration.map(addDuration) })
  }

  loadRemaining = () => {
    const { locations } = this.state
    const lastItemId = locations[locations.length - 1].id

    fetchLocations(0, lastItemId)
      .then(newLocations => {
        this.setState({ locations: [...locations, ...newLocations] }, this.setCurrentLocation)
      })
  }

  render() {
    const { locations } = this.state
    const loading = locations == null
    const showOpen = window.location.search.includes('hours=open')
    const sortDist = window.location.search.includes('sort=dist')
    const locationsList = Object.values(locations || {})
    const queryString = window.location.search
    const filteredLocations = filterByOptionsString(queryString.slice(1, queryString.length), locationsList)

    if (sortDist) {
      filteredLocations.sort((a, b) => {
        if (a.duration && b.duration) {
          return a.duration.value - b.duration.value
        } else {
          return 0
        }
      })
    }

    return (
      <Layout>
        { loading ?
          <Loading /> :
          <div>
            <FilterBar
              showOpen={showOpen}
              sortDist={sortDist}
              queryString={queryString}
            />
            <LocationList locations={filteredLocations} />
          </div>
        }
        </Layout>
    )
  }
}
