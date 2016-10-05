import React, { Component } from 'react'

import icons from '../../icons/css/icons.css'
import { fetchTaxonomies } from '../../core/firebaseRestAPI'
import { taxonomiesWithIcons } from '../../lib/taxonomies'

import Home from '../../components/Home'
import Layout from '../../components/Layout'


class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      taxonomies: [],
    }
  }

  componentDidMount() {
    fetchTaxonomies()
      .then(taxonomies => {
        this.setState({
          taxonomies: taxonomiesWithIcons(taxonomies)
        })
      })
    document.title = 'Link-SF'
  }

  render() {
    const { taxonomies } = this.state

    return (
      <Layout>
        <Home categories={taxonomies} />
      </Layout>
    )
  }
}

export default HomePage
