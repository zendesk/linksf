/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import AdminTopBar from '../AdminTopBar'
import CategoryFilter from '../CategoryFilter'
import LocationList from '../LocationList'
import history from '../../core/history';
import { fetchLocations } from '../../core/firebaseApi'

class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showOpen: false,
      locations: [],
    }
  }

  componentWillMount() {
    fetchLocations()
      .then(locations => {
        this.setState({ locations })
      })
  }

  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };

  render() {
    const { locations } = this.state
    return (
      <div>
        <AdminTopBar/>
        <CategoryFilter/>
        <LocationList locations={locations}/>
      </div>
    )
  }

}

export default Admin
