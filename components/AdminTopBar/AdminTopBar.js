import React, { Component, PropTypes } from 'react'

import s from './AdminTopBar.css'
import { taxonomiesWithIcons } from '../../lib/taxonomies'

import Link from '../Link'

class AdminTopBar extends Component {

  static propTypes = {
    onSearch: PropTypes.func,
    onNewOrganization: PropTypes.func,
    onFilterTaxonomiesChange: PropTypes.func,
    taxonomies: PropTypes.array
  }

  constructor() {
    super()
    this.state = { filterTaxonomies: [] }
  }

  filterByTaxonomy = (taxonomy) => {
    const { filterTaxonomies } = this.state
    const newFilterTaxonomies = filterTaxonomies.includes(taxonomy.id) ?
      filterTaxonomies.filter(id => id !== taxonomy.id) :
      [...filterTaxonomies, taxonomy.id]
    this.props.onFilterTaxonomiesChange(newFilterTaxonomies)
    this.setState({ filterTaxonomies: newFilterTaxonomies })
  }

  renderTaxonomyFilter = (taxonomy, isActive) => {
    return (
      <button
        className={`${s.taxonomyFilter} ${isActive ? s.isActiveTaxonomy : s.isInactiveTaxonomy}`}
        onClick={e => this.filterByTaxonomy(taxonomy)}>
        <i className={`${s.categoryIcon} ${taxonomy.icon}`}></i>
        {taxonomy.name}
      </button>
    )
  }

  render() {
    const {
      onSearch,
      onNewOrganization,
      taxonomies,
    } = this.props

    const {
      filterTaxonomies
    } = this.state

    return (
      <div className={s.adminTopBar}>
        <div className={s.facilityFilterBar}>
          <input
            type="text"
            className={s.locationFilter}
            onChange={onSearch}
            placeholder="Search for an organization" />
          <Link to="/admin/organizations/new">
            <button className={s.newOrganization}>
              New Organization
            </button>
          </Link>
        </div>
        <div className={s.taxonomyFilterBar}>
          {taxonomies.map((taxonomy, index) => (
            <div key={taxonomy.id} className={s.taxonomyListItem}>
              {index > 0 && <div className={s.taxonomySpacer}></div>}
              {this.renderTaxonomyFilter(taxonomy, filterTaxonomies.includes(taxonomy.id))}
            </div>
          ))}
        </div>
      </div>
    )
  }
}



export default AdminTopBar
