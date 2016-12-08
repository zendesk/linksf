import React, { Component } from 'react'

import globalConfig from '../../config'

import icons from '../../icons/css/icons.css'
import { fetchTaxonomies } from '../../core/firebaseRestAPI'
import { taxonomiesWithIcons } from '../../lib/taxonomies'

import Home from '../../components/Home'
import Layout from '../../components/Layout'
import Loading from '../../components/Loading'


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
    document.title = globalConfig.title
  }

  render() {
    const { taxonomies } = this.state

    return (
      <Layout>
        { taxonomies.length ? <Home categories={taxonomies} /> : <Loading /> }
      </Layout>
    )
  }
}

export default HomePage
