import React, { PropTypes } from 'react'

import { fetchLocations } from '../../core/firebaseRestAPI'
import history from '../../core/history';

import Loading from '../Loading'
import AdminTopBar from '../AdminTopBar'
import LocationList from '../LocationList'
import LocationEdit from '../LocationEdit'
import AdminLocationList from '../AdminLocationList'


class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      locations: [],
      selectedCategories: [],
      matchingSearchLocations: null,
      matchingCategoryLocations: null,
    }
  }

  componentWillMount() {
    fetchLocations()
      .then(locations => {
        this.setState({ loading: false, locations })
      })
  }

  handleSearch = (event) => {
    const searchTerm = event.currentTarget.value
    const { locations } = this.state
    const locationMatchesSearch = (location) => (location.name.indexOf(searchTerm) >= 0)
    const newMatchingSearchLocations = searchTerm ?
      locations.filter(locationMatchesSearch) :
      null

    this.setState({ matchingSearchLocations: newMatchingSearchLocations })
  }

  handleNewFacility = () => {

  }

  handleCategoryFilter = (category, active=false) => {
    const { locations, selectedCategories } = this.state

    const categoryNotMatchTaxonomy = (cat) => (cat != category.taxonomy)
    const newSelectedCategories = active ?
      selectedCategories.concat(category.taxonomy) :
      selectedCategories.filter(categoryNotMatchTaxonomy)

    const serviceHasMatchingTaxonomy = (service) => (newSelectedCategories.indexOf(service.taxonomy) >= 0)
    const locationHasServiceMatchingCategory = (location) => (location.services || []).some(serviceHasMatchingTaxonomy)
    const newMatchingCategoryLocations = (newSelectedCategories.length > 0) ?
      locations.filter(locationHasServiceMatchingCategory) :
      null

    this.setState({
      selectedCategories: newSelectedCategories,
      matchingCategoryLocations: newMatchingCategoryLocations,
    })
  }

  render() {
    const {
      loading,
      locations,
      selectedCategories,
      matchingSearchLocations,
      matchingCategoryLocations
    } = this.state

    let filteredLocations = null

    if (matchingSearchLocations) {
      const a = new Set(locations)
      const b = new Set(matchingSearchLocations)
      filteredLocations = [...(new Set([...a].filter(x => b.has(x))))]
    }

    if (matchingCategoryLocations) {
      const a = new Set(filteredLocations || locations)
      const b = new Set(matchingCategoryLocations)
      filteredLocations = [...(new Set([...a].filter(x => b.has(x))))]
    }

    return (
      <div>
        <AdminTopBar
          selectedCategories={selectedCategories}
          onSearch={this.handleSearch}
          onNewFacility={this.handleNewFacility}
          onCategoryFilter={this.handleCategoryFilter}
        />
        { loading ?
          <Loading /> :
          <AdminLocationList locations={filteredLocations || locations} /> }
      </div>
    )
  }

}

export default Admin
