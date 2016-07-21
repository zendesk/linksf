import React, { Component } from 'react'
import s from './Home.css'
import CategoryList from '../CategoryList'

const getCategories = (categoryNames) => (
  categoryNames.map(name => (
    { icon: 'icon-home', name: name[0].toUpperCase() + name.slice(1) }
  ))
)

const Home = (props) => (
  <div>
    <h1 className={s.title}>What service are you looking for?</h1>
    <form id="search-form">
      <CategoryList categories={getCategories(props.categories)} />
    </form>
  </div>
)

export default Home
