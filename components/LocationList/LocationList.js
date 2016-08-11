import React, { PropTypes } from 'react'
import s from './LocationList.css'
import LocationRow from '../LocationRow'

const LocationList = (props) => (
  <div className={s.column}>
    {props.locations.map(LocationRow)}
  </div>
)

export default LocationList
