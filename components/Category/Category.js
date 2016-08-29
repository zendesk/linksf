import React, { PropTypes } from 'react'
import s from './Category.css'
import Link from '../Link'
import icons from '../../icons/css/icons.css'

const category = (props) => (
  <Link to="/locations" query={{ categories: ['housing', 'food'], demographics: 'Y' }}>
    <button role="link" className={s.btn} aria-label="Look for ${props.name} services">
      <i className={`${s.categoryIcon} ${props.iconClass}`}></i>{props.name}
      <i className={`${s.rightCaret} ${icons.iconRightOpen2}`}></i>
    </button>
  </Link>
)

category.propTypes = {
  name: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
}

export default category
