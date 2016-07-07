import React, { Component } from 'react'
import s from './Home.css'
import CategoryList from '../CategoryList'
import {fetchCategories} from '../../core/firebase-api'

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
    fetchCategories().then((categories) => {
      this.setState({
        categories: categories,
        loading: false,
      })
      console.log(this.state)
    })
  }

  render() {
    const { categories } = this.state
    return (
      <div>
        <h1 className={s.title}>What service are you looking for?</h1>
        <form id="search-form">
          <CategoryList categories={getCategories(categories)} />
        </form>
      </div>
    )
  }
}
