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
      filteredLocations: null,
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
    let { locations, filteredLocations } = this.state

    if (searchTerm) {
      filteredLocations = locations.filter(location =>
        location.name.indexOf(searchTerm) >= 0)
    } else {
      filteredLocations = null
    }

    this.setState({
      locations,
      filteredLocations,
    })
  }

  handleNewFacility = () => {

  }

  handleCategoryFilter = (category) => {

  }

  render() {
    const { locations, filteredLocations } = this.state

    return (
      <div>
        <AdminTopBar
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
