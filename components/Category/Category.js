import React, { PropTypes } from 'react'
import './Category.scss'
import Link from '../Link'

const category = (props) => (
  <a href="/services" onClick={Link.handleClick}>
    <button role="link" className="category btn" aria-label="Look for ${props.name} services">
      <i className={`category-icon ${props.iconClass}`}></i>{props.name}
      <div className="chevron-container">
        <i className="icon-right-open-2 chevron"></i>
      </div>
    </button>
  </a>
)

category.propTypes = {
  name: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
}

export default category
