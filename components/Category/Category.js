import React, { PropTypes } from 'react'
import s from './Category.css'
import Link from '../Link'
import icons from '../../icons/css/icons.css'

const category = (props) => (
  <Link className="mdl-navigation__link" to="/services">
    <button role="link" className={s.btn} aria-label="Look for ${props.name} services">
      <i className={`icon-right-open-2 category-icon ${props.iconClass}`}></i>{props.name}
    </button>
  </Link>
)

category.propTypes = {
  name: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
}

export default category
