import React, { Component } from 'react'
import s from './Home.css'
import CategoryList from '../CategoryList'
import icons from '../../icons/css/icons.css'

const Home = (props) => (
  <div>
    <div className={s.spacer}></div>
    <div className={s.taxonomyList}>
      <p className={s.title}>What service are you looking for?</p>
      <CategoryList categories={props.categories} />
    </div>
  </div>
)

export default Home
