import React, { Component } from 'react'
import camelize from 'camelize'
import { currentUser, parseGoogleOauthResponse, setCurrentUser } from '../../lib/adminSession'

class OauthPage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    document.title = 'Link-SF Admin'

    parseGoogleOauthResponse()
      .then(response => response.json())
      .then(json => {
        const data = camelize(json)
        const user = {
          email: data.email,
          verified: data.emailVerified,
          tokenExpiresAt: data.exp
        }

        setCurrentUser(user)
        window.location = '/admin'
      })

    history.pushState('', document.title, window.location.pathname)
  }

  render() {
    return (
      <span>Loading...</span>
    )
  }
}

export default OauthPage
