import React, { PropTypes } from 'react'
import s from './Location.css'
import icons from '../../icons/css/icons.css'

import { relevantTaxonomies, getIcon } from '../../lib/taxonomies'
import { capitalize } from '../../lib/stringHelpers'

import Link from '../Link'
import GoogleMap from '../GoogleMap'

const getGender = (abbr) => {
  if (abbr === '' || abbr === 'MF' || abbr === 'FM') return 'Everyone'
  return abbr === 'F' ? 'Women' : 'Men'
}

const getGenderAdj = (abbr) => {
  if (abbr === '' || abbr === 'MF' || abbr === 'FM') {
    return 'All'
  }
  return abbr === 'F' ? 'Female' : 'Male'
}

const getAge = (abbr) => {
  switch (abbr) {
    case 'C':
      return 'children'
    case 'Y':
      return 'teens'
    case 'A':
      return 'adults'
    case 'S':
      return 'seniors'
    default:
      return ''
  }
}

const getAllGendersAndAges = (services) => {
  const allGendersAndAges = Object.values(services)
    .map(service => service.eligibility)
    .reduce((acc, eligibility) => {
      const { gender, age } = acc
      const moreGender = [...gender, eligibility.gender]
      const moreAge = eligibility.age ? [...age, ...eligibility.age] : age // ['C', 'Y']
      return { gender: moreGender, age: moreAge }
    }, { gender: [], age: [] })
  return {
    gender: Array.from(new Set(allGendersAndAges.gender)).join(''),
    age: Array.from(new Set(allGendersAndAges.age)),
  }
}

const getEligibility = ({ gender, age = [] }) => {
  if (gender === '' && age.length === 0) {
    return getGender(gender)
  }

  const ages = age.map(getAge).join(', ')

  return `${getGenderAdj(gender)} ${ages}`
}

const getMapsUrl = (location) => {
  const { latitude, longitude } = location
  return `https://maps.google.com/maps?q=loc:${latitude},${longitude}`
}

const DAYS = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday"
}

const dayAbbreviations = {
  sunday: "Sun",
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat"
}

const convertMilitaryTime = (time) => {
  let hours = time / 100
  let mins = time % 100
  let output = ''
  if (hours < 12) {
     output += hours
     if (mins > 0) {
        output += `:${mins}`
     }
     output += 'am'
  } else {
     output += hours - 12
     if (mins > 0) {
        output += `:${mins}`
     }
     output += 'pm'
  }
  return output
}

const getSchedule = (schedules) => {
  const daySchedules = {}
  schedules.reduce((acc, schedule) => {
    return acc.concat(schedule)
  }, [])
  .map(schedule => {
    let day = schedule.weekday.toLowerCase()
    let daySchedule = daySchedules[day]
    if (!daySchedule) {
      daySchedule = []
      daySchedules[day] = daySchedule
    }
    daySchedule.push({
      opensAt: schedule.opensAt,
      closesAt: schedule.closesAt
    })
  })
  return Object.keys(DAYS).sort().map(i => {
    let day = DAYS[i]
    let daySchedule = daySchedules[day]
    if (day) {
      return (
        <tr key={`day-${i}`}>
          <td className={s.labelHour}>
            <b>{dayAbbreviations[day]}</b>
          </td>
          <td className={s.hour}>
            {
              daySchedule.sort((a, b) => {
                a.opensAt < b.opensAt
              }).map(hours => {
                return `${convertMilitaryTime(hours.opensAt)} - ${convertMilitaryTime(hours.closesAt)}`
              }).join(', ')
            }
          </td>
        </tr>
      )
    }
  })
}

const Location = (props) => {
  const { location, organization } = props
  const { services = [] } = location
  return (
    <div className={s.location}>
      <h2>{location.name}</h2>
      <h2 className={s.title}>Welcome</h2>
      <div className={s.inset}>
        {getEligibility(getAllGendersAndAges(services))}
      </div>
      <h2 className={s.title}>Services</h2>
      <div className={s.inset}>
        <div className={s.categoryIcons}>
          {relevantTaxonomies(services).map((taxonomy, index) => (
            <span key={`category-${index}`}>
              <i className={`category-icon ${getIcon(taxonomy)}`}></i>
              {capitalize(taxonomy)}
            </span>
          ))}
        </div>
      </div>
      <div className={s.insetMap}>
        <div className={s.map}>
          <GoogleMap />
        </div>
        <p className={s.address}>
          {location.physicalAddress.address1}
        </p>
      </div>
      <div className={s.insetCall}>
        <label className={`${s.contactLabel} ${icons.iconPhone} icon-phone`}>Call </label>
        <div className={s.callPhone}>
          {organization.phones && organization.phones.map((phone, index) => (
            <div key={`phone-${index}`}>
              <a
                className={s.phone}
                href={'tel:' + phone.number.replace(/[^\d]/g, '')}
              >{phone.number}</a>
              <span>{phone.department}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={s.insetWebsite}>
        <label className={`${s.contactLabel} ${icons.iconLink} icon-website`}>Website </label>
        <span className={s.websiteUrl}>
          <a
            className={s.website}
            href={organization.url}
            rel="nofollow"
            target="_blank">
            {organization.url}
          </a>
        </span>
      </div>
      <a
        href={getMapsUrl(location)}
        rel="nofollow"
        target="_blank"
      >
        <button className={s.insetDirections}>
          <label className={`${s.directionsLabel} ${icons.iconCompass} icon-compass`}>Directions</label>
        </button>
      </a>
      <ul title="Services details" className={s.servicesList}>
        {services && Object.values(services).map((service, index) => (
          <li key={`service-${index}`} className={s.insetServices}>
            <h3 className={s.serviceTitle}>{service.name}</h3>
            <p className={s.serviceDescription}>{service.description}</p>
            <table className={s.openHours}>
              <tbody>
                {getSchedule(service.schedules)}
              </tbody>
            </table>
            <div className={s.notes}>
              <label>Notes</label>
              <p>{service.applicationProcess}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Location
