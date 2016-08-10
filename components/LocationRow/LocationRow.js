import React, { PropTypes } from 'react'
import s from './LocationRow.css'
import icons from '../../icons/css/icons.css'

import ServiceStatus from '../ServiceStatus'

const DistanceText = (props) => (
  <span className={s.distanceText}>{props.time} minutes walking</span>
)

const capitalize = (string) => string && string[0].toUpperCase() + string.slice(1)

const getIcon = (taxonomy) => icons[`icon${capitalize(taxonomy)}`]

const IconSpans = (props) => (
  <div className={s.categoryIcons}>
    {props.taxonomies.map((taxonomy, index) => (
      <span key={`category-${index}`}>
        <i className={`category-icon ${getIcon(taxonomy)}`}></i>
      </span>
    ))}
    <span key={'category-152341214'}>
      <i className={`category-icon ${icons.iconMedical}`}></i>
    </span>
  </div>
)

const relevantTaxonomies = (services) => (
  Array.from(new Set(services.map(service => service.taxonomy)))
)

const LocationRow = (props) => (
  <li className={s.location} key={`location-${props.id}`}>
    <a href={`/locations/${props.id}`} className={s.locationLink} title={`Click to see more details about ${props.name}`}>
      <div className={s.locationAndCaret}>
        <div className={s.locationBox}>
          <span className={s.locationName}>{props.name}</span>
          <div className={s.locationInfo}>
            <span className={s.locationStatus}>
              {/*<ServiceStatus schedules={props.regularSchedules} />*/}
              open
            </span>
            <IconSpans taxonomies={relevantTaxonomies(props.services)} />
            {props.duration && <DistanceText text={props.duration.text} />}
          </div>
        </div>
        <div className="location-item-box-caret">
          <i className={`${icons.iconRightOpen2} s.rightCaret`}></i>
        </div>
      </div>
    </a>
  </li>
)

export default LocationRow
