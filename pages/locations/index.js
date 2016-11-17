import React, { Component } from 'react'

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

export default class LocationsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      locations: null,
      currentLocation: null,
    }
  }

  componentDidMount() {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(this.setCurrentLocation)
    } else {
      this.setLocations()
    }

    document.title = 'Link-SF'

    fetchLocations()
      .then(locations => {
        this.setState({ locations })
      })
  }

  setCurrentLocation = (currentLocation) => {
    this.setState({ currentLocation }, this.setLocations)
  }

  setLocations = () => {
    const { currentLocation } = this.state

    if (currentLocation) {
      let locationsCache
      fetchLocations()
        .then(locations => {
          locationsCache = locations
          return calculateAllDistances(locations, currentLocation)
        })
        .then(matrixResponse => {
          const matrixResponses = matrixResponse.rows[0].elements
          this.setState({ locations: mergeLocationsAndDistances(locationsCache, matrixResponse) })
        })
    } else {
      fetchLocations()
        .then(locations => {
          this.setState({ locations })
        })
    }
  }

  render() {
    const { locations } = this.state
    const loading = locations == null
    const category = getParameterByName('categories')
    const showOpen = window.location.search.includes('hours=open')
    const locationsList = Object.values(locations || {})
    const queryString = window.location.search

    console.log(locations)
    const filteredLocations = filterByOptionsString(queryString.slice(1, queryString.length), locationsList)

    return (
      <Layout>
        { loading ?
          <Loading /> :
          <div>
            <FilterBar
              showOpen={showOpen}
              queryString={queryString}
            />
            <LocationList locations={filteredLocations} />
          </div>
        }
        </Layout>
    )
  }
}
