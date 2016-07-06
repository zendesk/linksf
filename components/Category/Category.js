import React, { PropTypes } from 'react'
import s from './Category.css'
import Link from '../Link'

const category = (props) => (
  <Link className="mdl-navigation__link" to="/services">
    <button role="link" className={s.btn} aria-label="Look for ${props.name} services">
      <i className={`category-icon ${props.iconClass}`}></i>{props.name}
      <div className="chevron-container">
        <i className="icon-right-open-2 chevron"></i>
      </div>
    </button>
  </Link>
)

category.propTypes = {
  name: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
}

export default category
