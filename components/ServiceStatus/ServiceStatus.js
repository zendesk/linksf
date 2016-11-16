import React, { PropTypes } from 'react'
import s from './ServiceStatus.css'
import { isOpen } from '../../lib/filterLocations'


const ServiceStatus = (props) => {
  const openOrClosed = isOpen(props.services) ? 'open' : 'closed'
  const statusClassName = openOrClosed === 'open' ? s.open : s.closed

  return (
    <span className={statusClassName}>{openOrClosed}</span>
  )
}

export default ServiceStatus
