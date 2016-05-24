import React, { Component } from 'react'
import './root.scss'
import FilterBar from './../components/FilterBar'
import ServiceList from './../components/ServiceList'

export default class extends Component {
  render() {
    return (
      <div className="root">
          <FilterBar />
          <ServiceList />
      </div>
    )
  }
}
