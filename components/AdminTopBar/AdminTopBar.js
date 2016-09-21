import React, { Component, PropTypes } from 'react'

import s from './AdminTopBar.css'

import Link from '../Link'

class AdminTopBar extends Component {

  static propTypes = {
    onSearch: PropTypes.func,
    onNewOrganization: PropTypes.func,
  }

  render() {
    const {
      onSearch,
      onNewOrganization,
    } = this.props

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
      </div>
    )
  }
}

export default AdminTopBar
