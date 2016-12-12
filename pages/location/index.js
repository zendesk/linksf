import React, { Component } from 'react'

import globalConfig from '../../config'

import { fetchLocation, fetchOrganization } from '../../core/firebaseRestAPI'

import Layout from '../../components/Layout'
import Loading from '../../components/Loading'
import Location from '../../components/Location'

export default class LocationPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: null,
      organization: null,
    }
  }

  componentDidMount() {
    const match = this.props.route.pattern.exec(window.location.pathname)
    const locationId = match[1]

    fetchLocation(locationId)
      .then(location => {
        this.setState({ location })
        return fetchOrganization(location.organizationId)
      }).then(organization => {
        this.setState({ organization })
      })
  }

  componentDidUpdate() {
    const { location } = this.state
    document.title = location ? location.name : globalConfig.title
  }

  render() {
    const { location, organization } = this.state

    return (
      <Layout>
        {(location && organization) ?
          <Location location={location} organization={organization} /> :
          <Loading />
        }
      </Layout>
    )
  }
}
