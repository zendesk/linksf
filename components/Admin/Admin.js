/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react'
import AdminTopBar from '../AdminTopBar'
import LocationList from '../LocationList'
import history from '../../core/history'
import { fetchLocations } from '../../core/firebaseApi'

class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showOpen: false,
      locations: [],
      filteredLocations: null,
    }
  }

  componentWillMount() {
    fetchLocations()
      .then(locations => {
        this.setState(Object.assign({}, this.state, { locations }))
      })
  }

  handleSearch = (event) => {
    const searchTerm = event.currentTarget.value
    let { locations, filteredLocations } = this.state

    if (!searchTerm || searchTerm.length < 1) {
      filteredLocations = null
    } else {
      filteredLocations = locations.filter(function(loc) {
        return loc.name.indexOf(searchTerm) >= 0
      })
    }

    this.setState(Object.assign({}, this.state, {
      locations,
      filteredLocations,
    }))
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
