import React, { Component } from 'react'

import { fetchLocations } from '../../core/firebaseRestAPI'
import { calculateAllDistances } from '../../core/distance'

import Layout from '../../components/Layout'
import Loading from '../../components/Loading'
import FilterBar from '../../components/FilterBar'
import LocationList from '../../components/LocationList'

const compose = (fn, ...rest) =>
  rest.length === 0 ?
    fn :
    (...args) => fn(compose(...rest)(...args))

function mergeLocationsAndDistances(locations, matrixResponses) {
  const zip = (e, index) => {
    return [locations[index], matrixResponses[index]]
  }

  const merge = ([location, responseObj]) => {
    const locationAndDistance = location
    locationAndDistance.duration = (responseObj || {}).duration // i hate this; it breaks the consistency of the whole app
    return locationAndDistance
  }

  return locations.map((e, i) => merge(zip(e, i)))
}

export default class LocationsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      showOpen: false,
      locations: [],
      currentLocation: null,
    }
  }

  componentWillMount() {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(this.setCurrentLocation, this.setLocations)
    } else {
      this.setLocations()
    }
  }

  componentDidMount() {
    document.title = 'Link-SF'
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
          const locationsWithDistance = mergeLocationsAndDistances(locationsCache, matrixResponses)

          this.setState({ loading: false, locations: locationsWithDistance })
        })
    } else {
      fetchLocations()
        .then(locations => {
          this.setState({ loading: false, locations })
        })
    }
  }

  handleToggleOpen = () => {
    this.setState({ showOpen: !this.state.showOpen })
  }

  render() {
    const { loading, locations } = this.state

    const filteredLocations = locations.filter(loc => (
      loc.services &&
      loc.services.filter(service => service.taxonomy === 'housing'))
    )
    return (
      <Layout>
        { loading ?
          <Loading /> :
          <div>
            <FilterBar
              showOpen={this.state.showOpen}
              onToggleOpen={(e) => this.handleToggleOpen(e)}
            />
            <LocationList locations={filteredLocations} />
          </div>
        }
        </Layout>
    )
  }
}
