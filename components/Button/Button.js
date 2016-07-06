import React from 'react'
import s from './Button.css'

export default (props) => (
  <button className={s.button}>
    {props.children}
  </button>
)
