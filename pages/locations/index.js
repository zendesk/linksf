import React, { Component } from 'react'
import Layout from '../../components/Layout'
import FilterBar from '../../components/FilterBar'
import LocationList from '../../components/LocationList'
import { getLocations } from '../../core/firebaseApi'

export default class LocationsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showOpen: false,
      locations: [],
    }
  }

  componentWillMount() {
    getLocations()
      .then(locations => {
        this.setState({ locations })
      })
  }

  handleToggleOpen() {
    this.setState({ showOpen: !this.state.showOpen })
  }

  render() {
    const { locations } = this.state
    return (
      <Layout>
        <FilterBar
          showOpen={this.state.showOpen}
          onToggleOpen={(e) => this.handleToggleOpen(e)}
        />
        <LocationList locations={locations} />
      </Layout>
    )
  }
}
