import React, { Component } from 'react'
import camelize from 'camelize'

import { currentUser, parseGoogleOauthResponse, setCurrentUser } from '../../lib/adminSession'
import { googleCredentials } from '../../config/keys'

import Layout from '../../components/Layout'

class OauthPage extends Component {
  constructor(props) {
    document.title = 'Link-SF Admin'
    super(props)
    this.state = {}
  }

  componentWillMount() {
    parseGoogleOauthResponse()
  }

  render() {
    return (
      <Layout admin>
        <span>Loading...</span>
      </Layout>
    )
  }
}

export default OauthPage
