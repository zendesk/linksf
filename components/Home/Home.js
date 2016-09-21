import React, { Component } from 'react'
import s from './Home.css'
import CategoryList from '../CategoryList'
import icons from '../../icons/css/icons.css'
import { buildCategories } from '../../lib/categories'

const Home = (props) => (
  <div>
    <h1 className={s.title}>What service are you looking for?</h1>
    <CategoryList categories={props.categories} />
  </div>
)

export default Home
