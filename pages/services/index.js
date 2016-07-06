import React, { Component } from 'react'
import Layout from '../../components/Layout'
import FilterBar from '../../components/FilterBar'
import ServiceList from '../../components/ServiceList'

export default class extends Component {
  render() {
    return (
      <Layout>
        <FilterBar />
        <ServiceList />
      </Layout>
    )
  }
}
