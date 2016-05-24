import React from 'react'
import './Button.scss'

export default (props) => (
  <button className="button">
    {props.children}
  </button>
)
