import React, { Component } from 'react'

import { fetchOrganization } from '../../core/firebaseRestAPI'
import { authenticate } from '../../lib/session'
import { uuid } from '../../lib/uuid'

import Layout from '../../components/Layout'
import Loading from '../../components/Loading'
import OrganizationEdit from '../../components/OrganizationEdit'

const blankOrganization = () => ({
  id: uuid(),
  longDescription: "",
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
  }

  componentDidMount() {
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

  componentDidUpdate() {
    const { organization } = this.state

    if (organization && organization.name) {
      document.title = organization.name
    } else {
      document.title = 'Create Organization'
    }
  }

  render() {
    const { organization } = this.state

    return (
      <Layout admin>
        { organization ?
            <OrganizationEdit organization={organization} /> :
            <Loading />
        }
      </Layout>
    )
  }
}

export default OrganizationAdminPage
