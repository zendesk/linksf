import React, { Component } from 'react'

import globalConfig from '../../config'

import Loading from '../../components/Loading'
import Layout from '../../components/Layout'
import Admin from '../../components/Admin'

import { authenticate, currentUser } from '../../lib/session'

class AdminPage extends Component {
  componentWillMount() {
    authenticate()
  }

  componentDidMount() {
    document.title = `${globalConfig.title} Admin`
  }

  render() {
    const user = currentUser()

    return (
      <Layout admin>
        {user ? <Admin /> : <Loading />}
      </Layout>
    )
  }
}

export default AdminPage
