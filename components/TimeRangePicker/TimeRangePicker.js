import React, { PropTypes } from 'react'
import s from './TimeRangePicker.css'

const TimeRangePicker = (props) => {
  function rangeLabel() {
    return props.rangeLabel || 'Time Range Picker'
  }

  function startLabel() {
    return props.startLabel || 'Opens at:'
  }

  function endLabel() {
    return props.endLabel || 'Closes at:'
  }

  function startTime() {
    if (props.startTime) {
      let startTime = props.startTime.toString()
      return startTime.slice(0, 2) + ":" + startTime.slice(2, 4)
    } else {
      return "00:00"
    }
  }

  function endTime() {
    if (props.endTime) {
      let endTime = props.endTime.toString()
      return endTime.slice(0, 2) + ":" + endTime.slice(2, 4)
    } else {
      return "00:00"
    }
  }


  return (
    <div className={s.pickerBox}>
      <span className={s.pickerLabel}>{rangeLabel()}</span>
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
    </div>
  )
}

export default TimeRangePicker
