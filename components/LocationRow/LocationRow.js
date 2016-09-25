import React, { PropTypes } from 'react'
import s from './LocationRow.css'
import icons from '../../icons/css/icons.css'
import { relevantTaxonomies, getIcon } from '../../lib/taxonomies'
import ServiceStatus from '../ServiceStatus'
import Link from '../Link'

const DistanceText = (props) => (
  <span className={s.distanceText}>{props.time} minutes walking</span>
)


const IconSpans = (props) => (
  <div className={s.categoryIcons}>
    {props.taxonomies.map((taxonomy, index) => (
      <span key={`category-${index}`}>
        <i className={`category-icon ${getIcon(taxonomy)}`}></i>
      </span>
    ))}
  </div>
)

const LocationRow = (props) => (
  <li className={s.location} key={`location-${props.id}`}>
    <Link
      to={`/locations/${props.id}`}
      className={s.locationLink}
      title={`Click to see more details about ${props.name}`}
    >
      <div className={s.locationAndCaret}>
        <div className={s.locationBox}>
          <span className={s.locationName}>{props.name}</span>
          <div className={s.locationInfo}>
            <span className={s.locationStatus}>
              <ServiceStatus services={props.services || {}} />
            </span>
            <IconSpans taxonomies={relevantTaxonomies(props.services)} />
            {props.duration && <DistanceText text={props.duration.text} />}
          </div>
        </div>
        <div className="location-item-box-caret">
          <i className={`${icons.iconRightOpen2} s.rightCaret icon-caret`}></i>
        </div>
      </div>
    </Link>
  </li>
)

export default LocationRow
