import React, { PropTypes } from 'react'
import ToggleButton from '../ToggleButton'
import Button from '../Button'
import s from './FilterBar.css'
import Link from '../Link'

const FilterBar = (props) => (
  <div className={s.row}>
    <div className={s.filterOption}>
      <ToggleButton
        label="Sort by name"
        enabled={false}
        on
      />
    </div>
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
    <Link to="/options">
      <Button>OPTIONS</Button>
    </Link>
  </div>
)

FilterBar.propTypes = {}

export default FilterBar
