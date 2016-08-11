import React, { PropTypes } from 'react';
import history from '../../core/history';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: null,
      password: null,
    }
  }

  handleChange = function(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit = function(event) {
    // Do some stuff with firebase to login yee
  }

  render() {
    return (
      <div className={`loginBox`}>
        <div className={`username`}>
          <span className={`usernameLabel`}>Username </span>
          <input
            type="text"
            value={this.state.username}
            onChange={this.handleChange} />
        </div>
        <div className={`password`}>
          <span className={`passwordLabel`}>Password </span>
          <input
            type="password"
            value={this.state.password}
            onChange={this.handleChange} />
        </div>
        <div className={`loginSubmit`}>
          <button type="button" onClick={this.handleSubmit}>Login</button>
        </div>
      </div>
    );
  }
}

export default Login
