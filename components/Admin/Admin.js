import React, { Component, PropTypes } from 'react'

import { fetchOrganizations, fetchTaxonomies, fetchLocations } from '../../core/firebaseRestAPI'

import Loading from '../Loading'
import AdminTopBar from '../AdminTopBar'
import OrganizationList from '../OrganizationList'
import { taxonomiesWithIcons } from '../../lib/taxonomies'
import { categoriesFilter } from '../../lib/filterLocations'

class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      organizations: null,
      matchingSearchOrganizations: null,
      taxonomies: [],
      filterTaxonomies: [],
      locations : [],
    }
  }

  componentDidMount() {
    fetchOrganizations()
      .then(organizations => {
        this.setState({ organizations })
      })
    this.refreshLocations()
    this.refreshTaxonomies()
  }

  refreshLocations = () => {
    fetchLocations()
      .then(locations => {
        this.setState({ locations })
      })
  }

  refreshTaxonomies = () => {
    fetchTaxonomies()
      .then(taxonomies => {
        this.setState({
          taxonomies: taxonomiesWithIcons(taxonomies)
        })
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

  filterOrgs = (taxonomies) => {
    this.setState({ filterTaxonomies: taxonomies })
  }

  render() {
    const {
      organizations,
      matchingSearchOrganizations,
      taxonomies,
      filterTaxonomies,
      locations,
    } = this.state

    const loading = organizations == null
    const orgs = matchingSearchOrganizations || organizations || []
    const filterOptions = {
      categories: filterTaxonomies,
      demographics: [],
      gender: '',
      hours: 'all',
    }
    const locationFilterOptions = (location) => ({
      location,
      options: filterOptions,
      isValid: true,
    })
    const filteredOrgIds = locations.reduce((orgIds, loc) => {
      if (categoriesFilter(locationFilterOptions(loc)).isValid) {
        return [...orgIds, loc.organizationId]
      }
      return orgIds
    }, [])
    const filteredOrgs = (filteredOrgIds.length > 0) ? orgs.filter(org => filteredOrgIds.includes(org.id)) : orgs

    return (
      <div>
        <AdminTopBar
          onSearch={this.handleSearch}
          taxonomies={taxonomies}
          onFilterTaxonomiesChange={this.filterOrgs}
        />
        { loading ?
            <Loading /> :
            <OrganizationList organizations={filteredOrgs} /> }
      </div>
    )
  }
}

export default Admin
