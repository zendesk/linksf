import React, { Component } from 'react'
import { destroySession } from '../../lib/adminSession'

import Layout from '../../components/Layout'
import Login from '../../components/Login'

class LogoutPage extends Component {
  constructor(props) {
    document.title = 'Link-SF Admin'
    super(props)
  }

  render() {
    return (
      <Layout admin>
        <Login />
      </Layout>
    )
  }
}

export default LogoutPage
