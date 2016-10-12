import React, { PropTypes } from 'react'
import s from './CategoryList.css'
import Category from '../Category'
import icons from '../../icons/css/icons.css'

const CategoryList = (props) => (
  <div
    title="Services"
    className={`${s.taxonomies}`}
    style={ {height: 133*props.categories.length} }>
      {props.categories.map((category, i) => (
        <Category
          key={`category-${i}`}
          id={category.id}
          iconClass={category.icon}
          name={category.name} />
      ))}
  </div>
)

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
}

export default CategoryList
