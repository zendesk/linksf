import React, { PropTypes } from 'react'
import './ServiceRow.scss'

const ServiceRow = (props) => (
  <div className="row">
    <p>{props.name}</p>
    <p>{props.description}</p>
  </div>
)

export default ServiceRow
