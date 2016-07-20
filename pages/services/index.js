import React, { Component } from 'react'
import Layout from '../../components/Layout'
import FilterBar from '../../components/FilterBar'
import ServiceList from '../../components/ServiceList'

export default class extends Component {
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
        <ServiceList />
      </Layout>
    )
  }
}
