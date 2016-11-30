import React from 'react'
import s from './ToggleButton.css'

const ToggleButton = (props) => (
  <button
    className={`${s.toggleButton} ${props.enabled ? s.enabled : ''} ${props.extraClasses}`}
    onClick={props.onClick}
    title={props.label}
  >
  {props.label}
  </button>
)

export default ToggleButton
