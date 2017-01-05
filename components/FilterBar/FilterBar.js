import React, { PropTypes } from 'react'
import ToggleButton from '../ToggleButton'

import s from './FilterBar.css'
import Link from '../Link'

const getNewFilterQueryString = (queryString, showOpen) => (
  showOpen ? `${queryString}&hours=open` : queryString.replace('&hours=open', '')
)

const getNewSortQueryString = (queryString, sortDist) => (
  sortDist ? `${queryString}&sort=dist` : queryString.replace('&sort=dist', '')
)

const FilterBar = (props) => (
  <div className={s.row}>
    <div className={s.filterOption}>
      <Link to="/locations" replaceState queryString={getNewFilterQueryString(props.queryString, !props.showOpen)}>
        <ToggleButton
          visualOnly={true} // <span> instead of <button> as we're in a <Link>
          label="Open now"
          enabled={props.showOpen}
        />
      </Link>
    </div>
    <div className={s.filterOption}>
      <Link to="/locations" replaceState queryString={getNewSortQueryString(props.queryString, !props.sortDist)}>
        <ToggleButton
          visualOnly={true}
          label="Sort by distance"
          enabled={props.sortDist}
        />
      </Link>
    </div>
  </div>
)

FilterBar.propTypes = {}

export default FilterBar
