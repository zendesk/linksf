import React, { PropTypes } from 'react'
import s from './CategoryList.css'
import Category from '../Category'

// const categories = [
//   { icon: 'icon-home', name: 'Shelter' },
//   { icon: 'icon-food', name: 'Food' },
//   { icon: 'icon-plus', name: 'Medical' },
//   { icon: 'icon-droplet', name: 'Hygiene' },
//   { icon: 'icon-desktop', name: 'Technology' },
// ]

const CategoryList = (props) => (
  <ul title="Services" className={`${s.categories} btn-group`}>
    {props.categories.map((category, index) => (
      <li key={index} className={s.categoryItem}>
        <Category key={`category-${index}`} iconClass={category.icon} name={category.name} />
      </li>
    ))}
  </ul>
)

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
}


export default CategoryList
