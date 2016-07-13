import React from 'react'
import s from './CategoryList.css'
import Category from '../Category'
import icons from '../../icons/css/icons.css'

const categories = [
  { icon: icons.iconHome, name: 'Shelter' },
  { icon: icons.iconFood, name: 'Food' },
  { icon: icons.iconPlus, name: 'Medical' },
  { icon: icons.iconDroplet, name: 'Hygiene' },
  { icon: icons.iconDesktop, name: 'Technology' },
]

const CategoryList = () => (
  <ul title="Services" className={`${s.categories} btn-group`}>
    {categories.map((category, index) => (
      <li className={s.categoryItem}>
        <Category key={`category-${index}`} iconClass={category.icon} name={category.name} />
      </li>
    ))}
  </ul>
)

export default CategoryList
