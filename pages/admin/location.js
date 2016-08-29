import React, { Component } from 'react'
import { fetchLocation } from '../../core/firebaseApi'
import camelize from 'camelize'

import icons from '../../icons/css/icons.css'
import { authenticate } from '../../lib/adminSession'

import Layout from '../../components/Layout'
import LocationEdit from '../../components/LocationEdit'

class AdminLocationPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: null,
    }
  }

  componentWillMount() {
    authenticate()
    const match = this.props.route.pattern.exec(window.location.pathname)
    const locationId = match[1]

    fetchLocation(locationId)
      .then(location => {
        this.setState({ location: camelize(location) })
      })
  }

  render() {
    const { location } = this.state

    return (
      <Layout admin>
        {location ?
          <LocationEdit location={location} /> :
          "Loading..."}
      </Layout>
    )
  }
}

export default AdminLocationPage
