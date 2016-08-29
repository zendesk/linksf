import React, { PropTypes } from 'react'
import s from './Login.css'
import history from '../../core/history'
import { buildLoginURL } from '../../lib/adminSession'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <a href={buildLoginURL()}>Login with Google</a>
    )
  }
}

export default Login
