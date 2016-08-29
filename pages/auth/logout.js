import React, { Component } from 'react'
import { destroySession } from '../../lib/adminSession'

import Layout from '../../components/Layout'

class LogoutPage extends Component {
  constructor(props) {
    document.title = 'Link-SF Admin'
    super(props)
  }

  componentWillMount() {
    destroySession()
    window.location.replace('/login')
  }

  render() {
    return (
      <Layout admin>
        <span>Logging you out...</span>
      </Layout>
    )
  }
}

export default LogoutPage
