import React, { PropTypes } from 'react'
import Toggle from '../Toggle'
import Button from '../Button'
import s from './FilterBar.css'
import Link from '../Link'

const getNewQueryString = (queryString, showOpen) => (
  showOpen ? `${queryString}&hours=open` : queryString.replace('&hours=open', '')
)

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
      <Link to="/locations" queryString={getNewQueryString(props.queryString, !props.showOpen)}>
        <Toggle
          onLabel="YES"
          offLabel="NO"
          on={props.showOpen}
        />
      </Link>
    </div>
    <Link to="/options">
      <Button>OPTIONS</Button>
    </Link>
  </div>
)

FilterBar.propTypes = {}

export default FilterBar
