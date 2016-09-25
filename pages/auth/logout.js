import React, { Component } from 'react'
import { destroySession } from '../../lib/session'
import { redirectTo } from '../../lib/navigation'
import { firebaseClient } from '../../core/firebaseApi'

import Layout from '../../components/Layout'

class LogoutPage extends Component {
  componentWillMount() {
    firebaseClient().auth().signOut()
    destroySession()
    redirectTo('/login')
  }

  componentDidMount() {
    document.title = 'Link-SF Admin'
  }

  render() {
    return (
      <Layout admin></Layout>
    )
  }
}

export default LogoutPage
