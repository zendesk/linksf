import React, { PropTypes } from 'react'
import s from './ServiceStatus.css'

const isOpen = (schedules) => {
  const currentDay = 'Wednesday'
  const currentTime = 1400

  const isBetween = (num, min, max) => (
    num > min && num < max
  )

  const isSomethingSchedule = schedule => (
    currentDay === schedule.weekday &&
    isBetween(currentTime, schedule.opensAt, schedule.closesAt)
  )

  return schedules.filter(isSomethingSchedule).length > 0
}

const ServiceStatus = (props) => {
  const openOrClosed = isOpen(props.schedules) ? 'open' : 'closed'
  const statusClassName = openOrClosed === 'open' ? s.open : s.closed
  return (
    <span className={statusClassName}>{openOrClosed}</span>
  )
}

export default ServiceStatus
