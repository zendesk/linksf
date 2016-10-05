import React, { Component, PropTypes } from 'react'

import { fetchOrganizations } from '../../core/firebaseRestAPI'

import Loading from '../Loading'
import AdminTopBar from '../AdminTopBar'
import OrganizationList from '../OrganizationList'


class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      organizations: null,
      matchingSearchOrganizations: null,
    }
  }

  componentDidMount() {
    fetchOrganizations()
      .then(organizations => {
        this.setState({ organizations })
      })
  }

  handleSearch = (event) => {
    const { organizations } = this.state
    const searchTerm = event.currentTarget.value

    if (!searchTerm) {
      this.setState({ matchingSearchOrganizations: null })
      return
    }

    const doesMatchSearch = (organization) => (
      organization.name.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
    )

    this.setState({
      matchingSearchOrganizations: organizations.filter(doesMatchSearch)
    })
  }

  render() {
    const {
      organizations,
      matchingSearchOrganizations,
    } = this.state

    const loading = organizations == null
    const orgs = matchingSearchOrganizations || organizations || []

    return (
      <div>
        <AdminTopBar onSearch={this.handleSearch} />
        { loading ?
            <Loading /> :
            <OrganizationList organizations={orgs} /> }
      </div>
    )
  }
}

export default Admin
