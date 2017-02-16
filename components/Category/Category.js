import React, { PropTypes } from 'react'
import s from './Category.css'
import Link from '../Link'
import icons from '../../icons/css/icons.css'

const category = (props) => (
  <Link
    to="/locations"
    query={{ services: [props.name.toLowerCase()] }}
    className={s.category}
    aria-label={`Look for ${props.name} services`}
  >
    <span className={s.iconAndName}>
      <i className={`${s.categoryIcon} ${props.iconClass}`}></i>
      {props.name}
    </span>
  </Link>
)

category.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  iconClass: PropTypes.string,
}

export default category
