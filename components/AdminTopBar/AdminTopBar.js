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
import history from '../../core/history'
import s from './AdminTopBar.css'
import Category from '../Category'
import { categories } from '../../lib/categories'

class AdminTopBar extends React.Component {

  static propTypes = {
    onSearch: PropTypes.func,
    onNewFacility: PropTypes.func,
    onCategoryFilter: PropTypes.func,
  }

  render() {
    return (
      <div className={s.adminTopBar}>
        <div className={s.facilityFilterBar}>
          <input
            type="text"
            className={s.locationFilter}
            onChange={this.props.onSearch}
            placeholder="Search for a facility"
          />
          <button
            className={s.newFacility}
            onClick={this.props.onNewFacility}
          >
          New Facility
          </button>
        </div>
        <div className={s.facilityCategoryFilterBar}>
          <p className={s.helpText}>Filter by Category</p>
          {categories.map((category, i) => (
            <button
              key={`category-${i}`}
              className={s.facilityCategoryFilterButton}
              onClick={this.props.onCategoryFilter}
            >
              <i className={`${s.categoryIcon} ${category.icon}`}></i>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    )
  }

}

export default AdminTopBar
