import React, { PropTypes } from 'react'
import s from './Login.css'
import history from '../../core/history'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: null,
      password: null,
    }
  }

  handleChange = function(event) {
    this.setState({value: event.target.value})
  }

  handleSubmit = function(event) {
    // Do some stuff with firebase to login yee
  }

  render() {
    return (
      <div className={s.loginBox}>
        <div className={s.username}>
          <span className={s.usernameLabel}>Username </span>
          <input
            type="text"
            value={this.state.username}
            onChange={this.handleChange} />
        </div>
        <div className={s.password}>
          <span className={s.passwordLabel}>Password </span>
          <input
            type="password"
            value={this.state.password}
            onChange={this.handleChange} />
        </div>
        <div className={s.loginSubmit}>
          <button type="button" onClick={this.handleSubmit}>Login</button>
        </div>
      </div>
    )
  }
}

export default Login
