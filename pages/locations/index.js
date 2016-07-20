import React, { Component } from 'react'
import Layout from '../../components/Layout'
import FilterBar from '../../components/FilterBar'
import LocationList from '../../components/LocationList'

export default class LocationsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showOpen: false,
    }
  }

  handleToggleOpen() {
    this.setState({ showOpen: !this.state.showOpen })
  }

  render() {
    return (
      <Layout>
        <FilterBar
          showOpen={this.state.showOpen}
          onToggleOpen={(e) => this.handleToggleOpen(e)}
        />
        <LocationList />
      </Layout>
    )
  }
}
