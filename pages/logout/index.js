import React, { Component } from 'react'
import { destroySession } from '../../lib/adminSession'

class LogoutPage extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    destroySession()

    window.location = "/"
  }

  componentDidMount() {
    document.title = 'Link-SF Admin'
  }

  render() {
    return "Logging you out..."
  }
}

export default LogoutPage
