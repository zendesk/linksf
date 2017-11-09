import React, { PropTypes } from 'react'
import s from './Login.css'
import history from '../../core/history'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
    }
  }

  handleChange = (field, event) => {
    const fields = {}
    fields[field] = event.target.value

    this.setState(fields)
  }

  handleSubmit = event => {
    const { email, password } = this.state

    this.props.handleSubmit(email, password)
  }

  render() {
    return (
      <div className={s.loginBox}>
        <div className={s.fieldContainer}>
          <label className={s.emailLabel} for="email">Email</label>
          <br />
          <input
            id="email"
            className={s.loginField}
            type="text"
            value={this.state.email}
            onChange={e => this.handleChange('email', e)}
          />
        </div>
        <div className={s.fieldContainer}>
          <label className={s.passwordLabel} for="password">Password</label>
          <br />
          <input
            id="password"
            className={s.loginField}
            type="password"
            onKeyPress={target => target.charCode === 13 && this.handleSubmit()}
            value={this.state.password}
            onChange={e => this.handleChange('password', e)}
          />
        </div>
        <div className={s.loginSubmit}>
          <button type="button" className={s.btn} onClick={this.handleSubmit}>Login</button>
        </div>
      </div>
    )
  }
}

export default Login
