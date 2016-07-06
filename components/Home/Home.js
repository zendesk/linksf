import React, { Component } from 'react'
import s from './Home.css'
import CategoryList from '../CategoryList'

const Home = class Home extends Component {
  render() {
    return (
      <div>
        <h1 className={s.title}>What service are you looking for?</h1>
        <form id="search-form">
          <CategoryList />
        </form>
      </div>
    )
  }
}

export default Home
