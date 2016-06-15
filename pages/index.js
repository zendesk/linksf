import React, { Component } from 'react'
import './root.scss'
import CategoryList from './../components/CategoryList'
import Rebase from 're-base'
const base = Rebase.createClass('https://vivid-inferno-4672.firebaseio.com/')

const getCategories = (categoryNames) => (
  categoryNames.map(name => (
    { icon: 'icon-home', name: name[0].toUpperCase() + name.slice(1) }
  ))
)

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      categories: [],
      loading: true,
    }
  }

  componentWillMount() {
    base.bindToState('taxonomies', {
      context: this,
      state: 'categories',
      asArray: true,
    })
  }

  render() {
    const { categories } = this.state
    return (
      <div className="root">
        <h1 className="title">What service are you looking for?</h1>
        <CategoryList categories={getCategories(categories)} />
      </div>
    )
  }
}
