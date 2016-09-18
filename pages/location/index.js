import React, { Component } from 'react'
import Layout from '../../components/Layout'
import Location from '../../components/Location'
import { fetchLocation, fetchOrganization } from '../../core/firebaseRestAPI'
import camelize from 'camelize'

export default class LocationPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: null,
      organization: null,
    }
  }

  componentWillMount() {
    const match = this.props.route.pattern.exec(window.location.pathname)
    const locationId = match[1]

    fetchLocation(locationId)
      .then(location => {
        this.setState({ location: camelize(location) })
        return fetchOrganization(location.organization_id)
      }).then(organization => {
        this.setState({ organization: camelize(organization) })
      })
  }

  componentDidUpdate() {
    const { location } = this.state
    document.title = location ? location.name : 'Link-SF'
  }

  render() {
    const { location, organization } = this.state

    return (
      <Layout>
        {(location && organization) ?
          <Location location={location} organization={organization} /> :
          'Loading'
        }
      </Layout>
    )
  }
}
