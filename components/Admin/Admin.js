import React, { PropTypes } from 'react'

import { fetchLocations } from '../../core/firebaseRestAPI'
import history from '../../core/history';

import Loading from '../Loading'
import AdminTopBar from '../AdminTopBar'
import OrganizationList from '../OrganizationList'
import OrganizationEdit from '../OrganizationEdit'
import LocationEdit from '../LocationEdit'

import history from '../../core/history';
import { fetchOrganizations } from '../../core/firebaseApi'
import { putOrganization } from '../../core/firebaseApi'
import { putLocation } from '../../core/firebaseApi'

function makeId() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 10; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}


class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      organizations: null,
      selectedCategories: [],
      matchingSearchOrganizations: null,
      showEditPage: false,
      currentOrganization: null,
      currentOrganizationIndex: 0,
    }
  }

  componentWillMount() {
    this.refreshOrganizations()
  }

  refreshOrganizations = () => {
    fetchOrganizations()
      .then(organizations => {
        console.log(organizations)
        this.setState({ organizations })
      })
  }

  handleSearch = (event) => {
    const searchTerm = event.currentTarget.value
    const { organizations } = this.state
    const organizationMatchesSearch = (organization) => (organization.name.indexOf(searchTerm) >= 0)
    const newMatchingSearchOrganizations = searchTerm ?
      organizations.filter(organizationMatchesSearch) :
      null

    this.setState({ matchingSearchOrganizations: newMatchingSearchOrganizations })
  }

  blankOrganization = () => {
    return {
      id: makeId(),
      long_description: "",
      name: "",
      url: ""
    }
  }

  handleNewOrganization = () => {
    this.setState({ showEditPage: true, currentOrganization: this.blankOrganization()})
  }

  handleDeleteOrganization = (index) => {
    const { organizations } = this.state
    const newOrganizations = organizations
    newOrganizations.splice(index, 1)
    this.setState({ showEditPage: false, organizations: newOrganizations})
  }

  handleEditFormSubmit = (organization, locations) => {
    var orgKey = putOrganization(organization)
    locations.map((loc) => putLocation(loc))

    this.refreshOrganizations()
    organization.key = newKey

    this.setState({ showEditPage: true, currentOrganization: organization })
  }

  renderEditPage = (organization, index) => {
    this.setState({ showEditPage: true, currentOrganization: organization, currentOrganizationIndex: index})
  }

  render() {
    const {
      organizations,
      selectedCategories,
      matchingSearchOrganizations,
      showEditPage,
      currentOrganization,
      currentOrganizationIndex
    } = this.state

    const loading = organizations == null

    return (
      <div>
        <AdminTopBar
          selectedCategories={selectedCategories}
          onSearch={this.handleSearch}
          onNewOrganization={this.handleNewOrganization}
        />
        { loading ?
          <Loading /> :
          (showEditPage ?
            <OrganizationEdit organization={currentOrganization} index={currentOrganizationIndex} handleUpdate={this.handleEditFormSubmit} handleDelete={this.handleDeleteOrganization} /> :
            <OrganizationList organizations={matchingSearchOrganizations || organizations || []} editLink={this.renderEditPage} />) }
      </div>
    )
  }
}

export default Admin
