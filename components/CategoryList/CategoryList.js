import React, { PropTypes } from 'react'
import s from './CategoryList.css'
import Category from '../Category'
import icons from '../../icons/css/icons.css'

const CategoryList = (props) => (
  <ul title="Services" className={`${s.categories} btn-group`}>
    {props.categories.map(category => (
      <li key={`category-${category.id}`} className={s.categoryItem}>
        <Category id={category.id} iconClass={category.icon} name={category.name} />
      </li>
    ))}
  </ul>
)

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
}

export default CategoryList
