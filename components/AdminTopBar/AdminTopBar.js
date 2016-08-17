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

  getCategoryFilterClass = (category) => {
    const { selectedCategories } = this.props
    let classes = [s.facilityCategoryFilterButton]

    if (this.isSelectedCategory(category))
      classes.push(s.facilityCategoryFilterButtonActive)

    return classes.join(' ')
  }

  isSelectedCategory = (category) => (
    this.props.selectedCategories.indexOf(category.taxonomy) >= 0
  )

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
              className={this.getCategoryFilterClass(category)}
              onClick={(e) => this.props.onCategoryFilter(category, !this.isSelectedCategory(category))}
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
