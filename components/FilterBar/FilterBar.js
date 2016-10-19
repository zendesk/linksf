import React, { PropTypes } from 'react'
import ToggleButton from '../ToggleButton'

import s from './FilterBar.css'
import Link from '../Link'

const FilterBar = (props) => (
  <div className={s.row}>
    <div className={s.filterOption}>
      <ToggleButton
        label="Sort by distance"
        enabled={true}
        on
      />
    </div>
    <div className={s.filterOption}>
      <ToggleButton
        label="Open now"
        enabled={props.showOpen}
        onClick={props.onToggleOpen}
      />
    </div>
  </div>
)

FilterBar.propTypes = {}

export default FilterBar
