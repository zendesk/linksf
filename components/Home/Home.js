import React, { Component } from 'react'
import s from './Home.css'
import CategoryList from '../CategoryList'
import icons from '../../icons/css/icons.css'
import { buildCategories } from '../../lib/categories'

const Home = (props) => (
  <div>
    <h1 className={s.title}>What service are you looking for?</h1>
    <form id="search-form">
      <CategoryList categories={props.categories} />
    </form>
  </div>
)

export default Home
