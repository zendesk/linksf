import React, { PropTypes } from 'react'
import ToggleButton from '../ToggleButton'

import s from './FilterBar.css'
import Link from '../Link'

const getNewQueryString = (queryString, showOpen) => (
  showOpen ? `${queryString}&hours=open` : queryString.replace('&hours=open', '')
)

const FilterBar = (props) => (
  <div className={s.row}>
    <div className={s.filterOption}>
      <ToggleButton
        label="Sort by distance"
        enabled
        on
      />
    </div>
    <div className={s.filterOption}>
      <Link to="/locations" queryString={getNewQueryString(props.queryString, !props.showOpen)}>
        <ToggleButton
          label="Open now"
          enabled={props.showOpen}
        />
      </Link>
    </div>
  </div>
)

FilterBar.propTypes = {}

export default FilterBar
