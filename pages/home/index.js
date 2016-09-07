import React, { Component } from 'react'
import Home from '../../components/Home'
import Layout from '../../components/Layout'
import icons from '../../icons/css/icons.css'
import { fetchTaxonomies } from '../../core/firebaseApi'

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      categories: [],
    }
  }

  componentWillMount() {
    fetchTaxonomies()
      .then(categories => {
        this.setState({ categories })
      })
  }

  render() {
    const { categories } = this.state
    return (
      <Layout>
        <Home categories={categories} />
      </Layout>
    )
  }
}

export default HomePage
