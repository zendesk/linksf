import React, { Component } from 'react'
import Layout from '../../components/Layout'
import Admin from '../../components/Admin'
import Login from '../../components/Login'
import icons from '../../icons/css/icons.css'

class AdminPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: true,
      username: "",
      password: "",
    }
  }

  render() {
    const { loggedIn, username, password } = this.state
    return (
      <Layout admin>
        { loggedIn ? <Admin /> : <Login /> }
      </Layout>
    )
  }
}

export default AdminPage
