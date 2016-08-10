import React, { PropTypes } from 'react'
import s from './AdminLocationRow.css'
import icons from '../../icons/css/icons.css'

import ServiceStatus from '../ServiceStatus'

const AdminLocationRow = (props) => (
  <li className={s.location} key={`location-${props.location.id}`}>
      <a onClick={() => props.editLink(props.location)} className={s.locationLink} title={`Click to edit ${props.location.name}`}>
        <div>
          <div>
            <p className={s.locationName}>{props.location.name}</p>
          </div>
          <div className={s.locationBox}>
            <div className={s.locationInfo}>
              <span className={s.locationAddress}>
                {`${props.location.physical_address.address_1}, ${props.location.physical_address.city}`}
              </span>
              <div className={s.categoryIcons}>
                <span><i className={'category-icon ' + icons.iconHome}></i></span>
              </div>
            </div>
            <div className="location-item-box-caret">
              <i className={`${icons.iconRightOpen2} s.rightCaret`}></i>
            </div>
          </div>
        </div>
      </a>
    </li>
)

export default AdminLocationRow
