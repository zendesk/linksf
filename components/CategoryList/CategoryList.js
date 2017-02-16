import React, { PropTypes } from 'react'
import s from './CategoryList.css'
import Category from '../Category'
import icons from '../../icons/css/icons.css'

const CategoryList = (props) => (
  <div title="Services">
    {props.categories.map((category, i) => (
      <div>
        <div key={`category-${i}`} className={s.categoryContainer}>
          <Category
            id={category.id}
            className={s.categoryContainer}
            iconClass={category.icon}
            name={category.name} />
        </div>
        <div className={s.categorySpacer}></div>
      </div>
    ))}
  </div>
)

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
}

export default CategoryList
