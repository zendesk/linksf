import React, { PropTypes } from 'react'
import history from '../../core/history'
import s from './AdminTopBar.css'
import Category from '../Category'
import { categories } from '../../lib/categories'

class AdminTopBar extends React.Component {

  static propTypes = {
    onSearch: PropTypes.func,
    onNewOrganization: PropTypes.func,
  }

  render() {
    return (
      <div className={s.adminTopBar}>
        <div className={s.facilityFilterBar}>
          <input
            type="text"
            className={s.locationFilter}
            onChange={this.props.onSearch}
            placeholder="Search for an organization" />
          <button
            className={s.newOrganization}
            onClick={this.props.onNewOrganization}
          >
          New Organization
          </button>
        </div>
      </div>
    )
  }
}

export default AdminTopBar
