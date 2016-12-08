import React, { Component } from 'react'

import globalConfig from '../../config'

import { destroySession } from '../../lib/session'
import { redirectTo } from '../../lib/navigation'
import { firebaseClient } from '../../core/firebaseRestAPI'

import Layout from '../../components/Layout'

class LogoutPage extends Component {
  componentWillMount() {
    firebaseClient().auth().signOut()
    destroySession()
    redirectTo('/login')
  }

  componentDidMount() {
    document.title = `${globalConfig.title} Admin`
  }

  render() {
    return (
      <Layout admin></Layout>
    )
  }
}

export default LogoutPage
