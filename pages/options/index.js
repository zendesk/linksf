import React, { Component } from 'react'

import icons from '../../icons/css/icons.css'
import { fetchTaxonomies } from '../../core/firebaseRestAPI'
import { taxonomiesWithIcons } from '../../lib/taxonomies'

import Options from '../../components/Options'
import Layout from '../../components/Layout'


class OptionsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      taxonomies: [],
    }
  }

  componentWillMount() {
    fetchTaxonomies()
      .then(taxonomies => {
        this.setState({
          taxonomies: taxonomiesWithIcons(taxonomies)
        })
      })
  }

  componentDidMount() {
    document.title = 'Link-SF'
  }

  render() {
    const { taxonomies } = this.state

    return (
      <Layout>
        <Options categories={taxonomies} />
      </Layout>
    )
  }
}

export default OptionsPage
