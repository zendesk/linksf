import React, { PropTypes } from 'react'
import s from './ServiceStatus.css'

const days = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday"
}

const isOpen = (services) => {
  const now = new Date()
  const currentTime = now.getHours() * 100 + now.getMinutes()
  const currentDay = days[now.getDay()]

  const isBetween = (num, min, max) => (
    num > min && num < max
  )

  const scheduleContainsCurrentTime = (schedule) => (
    currentDay === schedule.weekday.toLowerCase() &&
      isBetween(currentTime, schedule.opensAt, schedule.closesAt)
  )

  const serviceHasMatchingSchedule = (service) => (
    (service.schedules || []).some(scheduleContainsCurrentTime)
  )

  return Object.values(services).some(serviceHasMatchingSchedule)
}

const ServiceStatus = (props) => {
  const openOrClosed = isOpen(props.services) ? 'open' : 'closed'
  const statusClassName = openOrClosed === 'open' ? s.open : s.closed

  return (
    <span className={statusClassName}>{openOrClosed}</span>
  )
}

export default ServiceStatus
