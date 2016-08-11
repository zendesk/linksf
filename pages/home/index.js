import React, { Component } from 'react'
import Home from '../../components/Home'
import Layout from '../../components/Layout'
import icons from '../../icons/css/icons.css'
import { fetchCategories } from '../../core/firebaseApi'

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      categories: [],
    }
  }

  componentWillMount() {
    fetchCategories()
      .then(categories => {
        this.setState({ categories })
      })
  }

  componentDidMount() {
    document.title = 'Link-SF'
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
