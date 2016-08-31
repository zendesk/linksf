import React, { PropTypes } from 'react'
import s from './Error.css'

const Error = (props) => (
  <div className={s.error}>
    {props.message}
  </div>
)

Error.propTypes = {
  message: PropTypes.string.isRequired,
}

export default Error
