import React from 'react'
import s from './ToggleButton.css'

const ToggleButton = (props) => (
  <button
    className={`${s.toggleButton} ${props.enabled ? s.enabled : ''}`}
    onClick={props.onClick}
    title={props.label}
    // disabled={props.disableButton}
  >
  {props.label}
  </button>
)

export default ToggleButton
