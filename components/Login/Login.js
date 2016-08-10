/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import history from '../../core/history';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
    }
  }

  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  }

  getInitialState = function() {
    return {value: 'Hello!'};
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
            onChange={this.handleChange}
          />
        </div>
        <div className={`password`}>
          <span className={`passwordLabel`}>Password </span>
          <input
            type="text"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </div>
        <div className={`loginSubmit`}>
          <button type="button" onClick={this.handleSubmit}>Login</button>
        </div>
      </div>
    );
  }
}

export default Login
