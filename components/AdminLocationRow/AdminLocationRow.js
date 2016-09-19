import React, { PropTypes } from 'react'
import s from './AdminLocationRow.css'
import icons from '../../icons/css/icons.css'

import Link from '../Link'

const AdminLocationRow = (props) => {
  const { location } = props

  return (
    <li
      className={s.location}
      key={`location-${location.id}`}
    >
      <Link
        to={`/admin/locations/${location.id}`}
        className={s.locationLink}
        title={`Click to edit ${props.location.name}`}
      >
        <p className={s.locationName}>{location.name}</p>
        <div className={s.locationBox}>
          <div className={s.locationInfo}>
            <span className={s.locationAddress}>
              {`${location.physicalAddress.address1}, ${location.physicalAddress.city}`}
            </span>
            <div className={s.categoryIcons}>
              <i className={`category-icon ${icons.iconHome}`}></i>
            </div>
          </div>
          <div className="location-item-box-caret">
            <i className={`${icons.iconRightOpen2} s.rightCaret`}></i>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default AdminLocationRow
