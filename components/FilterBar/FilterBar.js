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
        label="Open now"
        enabled={props.showOpen}
        onClick={props.onToggleOpen}
      />
    </div>

    <div className={s.filterOption}>
      <ToggleButton
        label="Sort by distance"
        enabled={true}
        on
      />
    </div>
  </div>
)

FilterBar.propTypes = {}

export default FilterBar
