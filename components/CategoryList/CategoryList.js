import React, { PropTypes } from 'react'
import s from './CategoryList.css'
import Category from '../Category'
import icons from '../../icons/css/icons.css'

const CategoryList = (props) => (
  <div
    title="Services"
    className={`${s.taxonomies}`}>
      {props.categories.map((category, i) => (
        <div key={`category-${i}`}>
          <Category
            id={category.id}
            iconClass={category.icon}
            name={category.name} />
          <div className={s.categorySpacer}></div>
        </div>
      ))}
  </div>
)

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
}

export default CategoryList
