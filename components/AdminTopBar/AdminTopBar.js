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
            placeholder="Search for a facility" />
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
