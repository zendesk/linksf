import React, { PropTypes } from 'react'
import s from './LocationRow.css'
import icons from '../../icons/css/icons.css'

import ServiceStatus from '../ServiceStatus'

const LocationRow = (props) => (
  <li className={s.location} key={`location-${props.id}`}>
      <a href={`/locations/${props.id}`} className={s.locationLink} title={`Click to see more details about ${props.name}`}>
        <div>
          <div>
            <p className={s.locationName}>{props.name}</p>
          </div>
          <div className={s.locationBox}>
            <div className={s.locationInfo}>
              <span className={s.locationStatus}>
                {/*<ServiceStatus schedules={props.regularSchedules} />*/}
                open maybe
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

export default LocationRow
