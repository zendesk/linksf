import React, { PropTypes } from 'react'
import s from './LocationRow.css'
import icons from '../../icons/css/icons.css'
import { relevantTaxonomies, getIcon } from '../../lib/taxonomies'
import ServiceStatus from '../ServiceStatus'
import Link from '../Link'

const DistanceText = (props) => (
  <div className={s.distanceText}>{props.text}</div>
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
          <div className={s.locationContainer}>
            <div className={s.locationName}>{props.name}</div>
          </div>
          <div className={s.locationInfo}>
            <IconSpans taxonomies={relevantTaxonomies(props.services)} />
          </div>
        </div>
        <div className={s.locationStatusBox}>
          <div className={s.locationStatusContainer}>
            <div className={s.locationStatus}>
              <ServiceStatus services={props.services || {}} />
            </div>
            {props.duration && <DistanceText text={props.duration.text} />}
          </div>
          <div className={s.locationItemBoxCaret}>
            <i className={`${icons.iconRightOpen2} ${s.rightCaret} icon-caret`}></i>
          </div>
        </div>
      </div>
    </Link>
  </li>
)

export default LocationRow
