import React from 'react'
import './CategoryList.scss'
import Category from '../Category'

const CategoryList = (props) => (
  <ul title="Services" className="categories btn-group">
    {props.categories.map((category, index) => (
      <li key={index} className="unselectable">
        <Category iconClass={category.icon} name={category.name} />
      </li>
    ))}
  </ul>
)

export default CategoryList
