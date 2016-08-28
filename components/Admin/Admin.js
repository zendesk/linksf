import React, { PropTypes } from 'react'
import AdminTopBar from '../AdminTopBar'
import LocationList from '../LocationList'
import LocationEdit from '../LocationEdit'
import CategoryFilter from '../CategoryFilter'
import AdminLocationList from '../AdminLocationList'
import history from '../../core/history';
import { fetchLocations } from '../../core/firebaseApi'

class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      locations: [],
      selectedCategories: [],
      matchingSearchLocations: null,
      matchingCategoryLocations: null,
      showEditPage: false,
      currentLocation: null,
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

  renderEditPage = (location) => {
    this.setState(Object.assign({}, this.state, {showEditPage: true, currentLocation: location}))
  }

  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };

  render() {
    const {
      locations,
      selectedCategories,
      matchingSearchLocations,
      matchingCategoryLocations,
      showEditPage,
      currentLocation
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

    const { locations, showEditPage, currentLocation } = this.state

    return (
      <div>
        <AdminTopBar
          selectedCategories={selectedCategories}
          onSearch={this.handleSearch}
          onNewFacility={this.handleNewFacility}
          onCategoryFilter={this.handleCategoryFilter}
        />
        {showEditPage ? 
          <LocationEdit location={currentLocation}/> :
          <div>
            <CategoryFilter />
            <AdminLocationList locations={filteredLocations || locations} editLink={this.renderEditPage} />
          </div>
        }
      </div>
    )
  }

}

export default Admin
