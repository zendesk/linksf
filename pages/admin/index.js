import React, { Component } from 'react'
import Layout from '../../components/Layout'
import Admin from '../../components/Admin'
import Login from '../../components/Login'
import icons from '../../icons/css/icons.css'
import { fetchCategories } from '../../core/firebaseApi'
import { currentUser } from '../../lib/adminSession'

class AdminPage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    document.title = 'Link-SF Admin'
  }

  render() {
    const user = currentUser()

    return (
      <Layout
        currentUser={user}
        admin
      >
        { user ? <Admin /> : <Login /> }
      </Layout>
    )
  }
}

export default AdminPage
