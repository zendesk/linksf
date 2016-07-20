import React, { Component } from 'react'
import Layout from '../../components/Layout'
import Location from '../../components/Location'
import { getLocation } from '../../core/firebaseApi'

export default class LocationPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: null,
    }
  }

  componentWillMount() {
    const match = this.props.route.pattern.exec(window.location.pathname)
    const locationId = match[1]
    getLocation(locationId)
      .then(location => {
        this.setState({ location })
      })
  }

  render() {
    const { location } = this.state
    return (
      <Layout>
        {location ?
          <Location location={location} /> :
          'Loading'
        }

      </Layout>
    )
  }
}
