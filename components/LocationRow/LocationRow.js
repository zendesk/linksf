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
      <div className={s.content}>
        <div className={s.details}>
          <div className={s.nameAndStatus}>
            <span className={s.name}>{props.name}</span>
            <ServiceStatus className={s.status} services={props.services} />
          </div>
          <div className={s.spacer}></div>
          <div className={s.iconsAndDistance}>
            <IconSpans taxonomies={relevantTaxonomies(props.services)} />
            {props.duration && <DistanceText text={props.duration.text} />}
          </div>
        </div>
        <div className={s.sidebar}>
          <i className={`${icons.iconRightOpen2} ${s.rightCaret} icon-caret`}></i>
        </div>
      </div>
    </Link>
  </li>
)

export default LocationRow
