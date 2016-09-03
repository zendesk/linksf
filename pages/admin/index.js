import React, { Component } from 'react'
import Layout from '../../components/Layout'
import Admin from '../../components/Admin'
import Login from '../../components/Login'
import icons from '../../icons/css/icons.css'
import { fetchCategories } from '../../core/firebaseApi'
import { authenticate, currentUser } from '../../lib/adminSession'

class AdminPage extends Component {
  constructor(props) {
    document.title = 'Link-SF Admin'
    super(props)
    this.state = {}
  }

  componentWillMount() {
    authenticate()
  }

  render() {
    const user = currentUser()

    return (
      <Layout admin>
        <Admin />
      </Layout>
    )
  }
}

export default AdminPage
