import React, { Component } from 'react'

import { fetchOrganization } from '../../core/firebaseRestAPI'
import { authenticate } from '../../lib/session'

import Layout from '../../components/Layout'
import Loading from '../../components/Loading'
import OrganizationEdit from '../../components/OrganizationEdit'

const makeId = () => {
  var text = ""
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for( var i=0; i < 10; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

const blankOrganization = () => ({
  id: makeId(),
  long_description: "",
  name: "",
  url: ""
})

class OrganizationAdminPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      organization: null,
    }
  }

  componentWillMount() {
    authenticate()

    const match = this.props.route.pattern.exec(window.location.pathname)
    const organizationId = match[1]

    if (organizationId === 'new') {
      this.setState({ organization: blankOrganization() })
    } else {
      fetchOrganization(organizationId)
        .then(organization => {
          this.setState({ organization })
        })
    }
  }

  componentDidMount() {
    const { organization } = this.state

    if (organization && organization.name) {
      document.title = organization.name
    } else {
      document.title = 'Create Organization'
    }
  }

  handleEditFormSubmit = (organization, locations) => {
    var orgKey = putOrganization(organization)
    locations.map((loc) => putLocation(loc))

    this.refreshOrganizations()
    organization.key = newKey

    this.setState({
      showEditPage: true,
      currentOrganization: organization
    })
  }

  handleDeleteOrganization = (index) => {
    const { organizations } = this.state
    const newOrganizations = organizations

    newOrganizations.splice(index, 1)

    this.setState({
      showEditPage: false,
      organizations: newOrganizations
    })
  }

  render() {
    const { organization } = this.state
    const loading = organization == null

    return (
      <Layout admin>
        { loading ?
            <Loading /> :
            <OrganizationEdit
              organization={organization}
              onUpdate={this.handleEditFormSubmit}
              onDelete={this.handleDeleteOrganization} />
        }
      </Layout>
    )
  }
}

export default OrganizationAdminPage
