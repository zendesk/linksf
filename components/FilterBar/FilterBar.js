import React, { Component, PropTypes } from 'react'
import Toggle from '../Toggle'
import Button from '../Button'
import s from './FilterBar.css'

class FilterBar extends Component {
  render() {
    return (
      <div className={s.row}>
        <label>
          <Toggle />
          <span>Sort by</span>
        </label>
        <label>
            <Toggle />
            <span>Open now</span>
        </label>
        <Button>OPTIONS</Button>
    </div>
    )
  }
}

FilterBar.propTypes = {}

export default FilterBar
