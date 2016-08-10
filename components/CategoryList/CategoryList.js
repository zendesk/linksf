import React, { PropTypes } from 'react'
import s from './CategoryList.css'
import Category from '../Category'
import icons from '../../icons/css/icons.css'

const categories = [
  { icon: icons.iconHousing, name: 'Shelter' },
  { icon: icons.iconFood, name: 'Food' },
  { icon: icons.iconPlus, name: 'Medical' },
  { icon: icons.iconMedical, name: 'Hygiene' },
  { icon: icons.iconTechnology, name: 'Technology' },
]

const CategoryList = (props) => (
  <ul title="Services" className={`${s.categories} btn-group`}>
    {categories.map((category, index) => (
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
