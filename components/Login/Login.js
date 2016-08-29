import React, { Component, PropTypes } from 'react'
import s from './Login.css'
import history from '../../core/history'
import { buildLoginURL } from '../../lib/adminSession'

class Login extends Component {
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
