import React, { Component } from 'react'

import { login } from '../../lib/session'
import { redirectTo } from '../../lib/navigation'

import Layout from '../../components/Layout'
import Login from '../../components/Login'
import Loading from '../../components/Loading'

class LoginPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggingIn: false
    }
  }

  handleSubmit = (email, password) => {
    this.setState({loggingIn: true})
    login(email, password, this.loginSuccess)
  }

  loginSuccess = () => {
    redirectTo('/admin')
  }

  render() {
    const { loggingIn } = this.state

    return (
      <Layout admin>
        {
          loggingIn ?
            <Loading /> :
            <Login handleSubmit={this.handleSubmit} />
        }
      </Layout>
    )
  }
}

export default LoginPage
