import React, { PropTypes } from 'react'

import { fetchOrganizations } from '../../core/firebaseRestAPI'
import history from '../../core/history';

import Loading from '../Loading'
import AdminTopBar from '../AdminTopBar'
import OrganizationList from '../OrganizationList'
import OrganizationEdit from '../OrganizationEdit'
import LocationEdit from '../LocationEdit'

import { putOrganization } from '../../core/firebaseApi'
import { putLocation } from '../../core/firebaseApi'

function makeId() {
  var text = ""
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for( var i=0; i < 10; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

const IndexOrShow = (props) => {
  const {
    showEditPage,
    handleSearch,
    handleNewOrganization,
    selectedCategories,
    currentOrganization,
    currentOrganizationIndex,
    handleEditFormSubmit,
    handleDeleteOrganization,
    matchingSearchOrganizations,
    organizations,
    renderEditPage,
  } = props

  return (
    showEditPage ?
      <OrganizationEdit
        organization={currentOrganization}
        index={currentOrganizationIndex}
        handleUpdate={handleEditFormSubmit}
        handleDelete={handleDeleteOrganization} /> :
      <div>
        <AdminTopBar
          selectedCategories={selectedCategories}
          onSearch={handleSearch}
          onNewOrganization={handleNewOrganization}
        />
        <OrganizationList
          organizations={matchingSearchOrganizations || organizations || []}
          editLink={renderEditPage} />
      </div>
  )
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

  blankOrganization = () => ({
    id: makeId(),
    long_description: "",
    name: "",
    url: ""
  })

  handleNewOrganization = () => {
    this.setState({
      showEditPage: true,
      currentOrganization: this.blankOrganization()
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

  renderEditPage = (organization, index) => {
    this.setState({
      showEditPage: true,
      currentOrganization: organization,
      currentOrganizationIndex: index
    })
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
        { loading ?
            <Loading /> :
            <IndexOrShow
              showEditPage={showEditPage}
              handleSearch={this.handleSearch}
              handleNewOrganization={this.handleNewOrganization}
              selectedCategories={selectedCategories}
              currentOrganization={currentOrganization}
              currentOrganizationIndex={currentOrganizationIndex}
              handleEditFormSubmit={this.handleEditFormSubmit}
              handleDeleteOrganization={this.handleDeleteOrganization}
              matchingSearchOrganizations={matchingSearchOrganizations}
              organizations={organizations}
              renderEditPage={this.renderEditPage} /> }
      </div>
    )
  }
}

export default Admin
