import React, { PropTypes } from 'react'
import s from './TimeRangePicker.css'

const TimeRangePicker = (props) => {
  const weekdays = [
    "-",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]

  function startLabel() {
    return props.startLabel || 'Opens at:'
  }

  function endLabel() {
    return props.endLabel || 'Closes at:'
  }

  function startTime() {
    if (props.startTime) {
      let startTime = props.startTime.toString()
      if (startTime.length != 4) {
        startTime = "0" + startTime
      }
      return startTime.slice(0, 2) + ":" + startTime.slice(2, 4)
    } else {
      return "00:00"
    }
  }

  function endTime() {
    if (props.endTime) {
      let endTime = props.endTime.toString()
      if (endTime.length != 4) {
        endTime = "0" + endTime
      }
      return endTime.slice(0, 2) + ":" + endTime.slice(2, 4)
    } else {
      return "00:00"
    }
  }


  return (
    <div className={s.pickerBox}>
      <select 
        value={props.weekday}
        onChange={(e) => props.handleUpdate(e, 'weekday', props.metadata)}
      >
        {weekdays.map((day) => (
          <option value={day}>{day}</option>
        ))}
      </select>
      <span className={s.pickerLabel}>{startLabel()}</span>
      <input
        type="time"
        className={s.pickerInput}
        value={startTime()}
        onChange={(e) => props.handleUpdate(e, 'start', props.metadata)}
      />
      <span className={s.pickerLabel}>{endLabel()}</span>
      <input
        type="time"
        className={s.pickerInput}
        value={endTime()}
        onChange={(e) => props.handleUpdate(e, 'end', props.metadata)}
      />
      <button
        className={s.buttonStyle}
        onClick={(e) => props.handleDelete(props.metadata.scheduleNum)}
      >
      Delete
      </button>
    </div>
  )
}

export default TimeRangePicker
