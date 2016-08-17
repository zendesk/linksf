import React, { PropTypes } from 'react'
import AdminTopBar from '../AdminTopBar'
import LocationList from '../LocationList'
import history from '../../core/history'
import { fetchLocations } from '../../core/firebaseApi'

class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      locations: [],
      selectedCategories: [],
      matchingSearchLocations: null,
      matchingCategoryLocations: null,
    }
  }

  componentWillMount() {
    fetchLocations()
      .then(locations => {
        this.setState({ locations })
      })
  }

  handleSearch = (event) => {
    const searchTerm = event.currentTarget.value
    let { locations, matchingSearchLocations } = this.state

    if (searchTerm) {
      matchingSearchLocations = locations.filter(location =>
        location.name.indexOf(searchTerm) >= 0)
    } else {
      matchingSearchLocations = null
    }

    this.setState({ matchingSearchLocations })
  }

  handleNewFacility = () => {

  }

  handleCategoryFilter = (category, active=false) => {
    let { locations, selectedCategories, matchingCategoryLocations } = this.state

    if (active) {
      selectedCategories.push(category.taxonomy)
    } else {
      selectedCategories = selectedCategories.filter(cat => cat != category.taxonomy)
    }

    if (selectedCategories.length > 0) {
      matchingCategoryLocations = locations.filter(location =>
        (location.services || []).some(service => selectedCategories.indexOf(service.taxonomy) >= 0))
    } else {
      matchingCategoryLocations = null
    }

    this.setState({ selectedCategories, matchingCategoryLocations })
  }

  render() {
    const {
      locations,
      selectedCategories,
      matchingSearchLocations,
      matchingCategoryLocations,
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
        <LocationList locations={filteredLocations || locations} />
      </div>
    )
  }

}

export default Admin
