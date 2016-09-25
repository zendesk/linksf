import React, { PropTypes } from 'react'
import Toggle from '../Toggle'
import Button from '../Button'
import s from './FilterBar.css'
import Link from '../Link'

const FilterBar = (props) => (
  <div className={s.row}>
    <div className={s.filterOption}>
      <label className={s.filterLabel}>
        Sort by
      </label>
      <Toggle
        onLabel="NAME"
        offLabel="NEAR"
        disabled
        on
      />
    </div>
    <div className={s.filterOption}>
      <label className={s.filterLabel}>
        Open now
      </label>
      <Toggle
        onLabel="YES"
        offLabel="NO"
        on={props.showOpen}
        onMouseUp={props.onToggleOpen}
      />
    </div>
    <Link to="/options">
      <Button>OPTIONS</Button>
    </Link>
  </div>
)

FilterBar.propTypes = {}

export default FilterBar
