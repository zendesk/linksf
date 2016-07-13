import React, { Component, PropTypes } from 'react'
import Toggle from '../Toggle'
import Button from '../Button'
import s from './FilterBar.css'

class FilterBar extends Component {
  render() {
    return (
      <div className={s.row}>
        <label>
          <Toggle
            onLabel="NAME"
            offLabel="NEAR"
            disabled
            on
          />
        </label>
        <label>
          <Toggle
            onLabel="YES"
            offLabel="NO"
            on={false}
          />
        </label>
        <Button>OPTIONS</Button>
      </div>
    )
  }
}

FilterBar.propTypes = {}

export default FilterBar
