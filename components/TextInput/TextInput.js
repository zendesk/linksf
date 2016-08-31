import React, { PropTypes } from 'react'
import s from './TextInput.css'

const TextInput = (props) => (
  <input className={s.input}
    {...props}
    type="text"
  />
)

TextInput.propTypes = {}

export default TextInput
