import React, { PropTypes } from 'react'
import s from './TextArea.css'

const TextArea = (props) => (
  <textarea className={s.input}
    {...props}
  />
)

TextArea.propTypes = {}

export default TextArea
