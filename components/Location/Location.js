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
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
}

const DAY = {
  Sunday: 'sunday',
  Monday: 'monday',
  Tuesday: 'tuesday',
  Wednesday: 'wednesday',
  Thursday: 'thursday',
  Friday: 'friday',
  Saturday: 'saturday',
}

const DAY_ABBREVIATIONS = {
  sunday: 'Sun',
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
}

const convertMilitaryTime = (time) => {
  const hours = Math.floor(time / 100)
  const mins = time % 100
  let output = ''
  if (hours < 12) {
    if (hours == 0) {
      output += 12
    } else {
      output += hours
    }
    if (mins > 0) {
      output += `:${mins}`
    }
    output += 'am'
  } else {
    if (hours == 12) {
      output += hours
    } else {
      output += hours - 12
    }
    if (mins > 0) {
      output += `:${mins}`
    }
    output += 'pm'
  }
  return output
}

const getDailySchedules = (schedules) => {
  const daySchedules = Object.assign({}, DAY_ABBREVIATIONS)
  Object.keys(daySchedules).forEach(day => {
    daySchedules[day] = []
  })
  schedules
    .forEach(schedule => {
      if(schedule.opensAt != schedule.closesAt) { // Check if location is open
        const day = schedule.weekday.toLowerCase()
        const daySchedule = daySchedules[day]
        daySchedule.push({
          opensAt: schedule.opensAt,
          closesAt: schedule.closesAt,
        })
      }
    })
  return daySchedules
}

const getTimeRange = hours => {
  if (hours.opensAt == 0 && hours.closesAt == 2359 ) {
    return `24 hours`
  } else {
    return `${convertMilitaryTime(hours.opensAt)} - ${convertMilitaryTime(hours.closesAt)}`
  }
}

const Schedule = (props) => {
  const daySchedules = getDailySchedules(props.schedules)
  const indexToDaySchedule = index => daySchedules[DAYS[index]]
  const dayHasSchedules = daySchedule => indexToDaySchedule(daySchedule).length > 0
  const scheduleRows = Object.keys(DAYS).sort()
    .filter(dayHasSchedules)
    .map(index => (
      <tr key={`day-${index}`}>
        <td className={s.labelHour}>
          <b>{DAY_ABBREVIATIONS[DAYS[index]]}</b>
        </td>
        <td className={s.hour}>
          {indexToDaySchedule(index)
              .sort((a, b) => a.opensAt < b.opensAt)
              .map(getTimeRange)
              .join(', ')
          }
        </td>
      </tr>
    ))
  return (
    <table className={s.openHours}>
      <tbody>
        {scheduleRows}
      </tbody>
    </table>
  )
}

const Location = (props) => {
  const { location, organization } = props
  const { services = [] } = location
  return (
    <div className={s.location}>
      <div className={s.section}>
        <h2 className={s.name}>{location.name}</h2>
        <span className={s.label}>Welcome: </span>
          {getEligibility(getAllGendersAndAges(services))}
      </div>
      <p className={s.title}>Services</p>
      <div className={s.section}>
        <div className={s.categoryIcons}>
          {relevantTaxonomies(services).map((taxonomy, index) => (
            <span key={`category-${index}`}>
              <i className={`category-icon ${getIcon(taxonomy)}`}></i>
              {capitalize(taxonomy)}
            </span>
          ))}
        </div>
      </div>
      {location.physicalAddress &&
        <div className={s.insetMap}>
          <div className={s.map}>
            <GoogleMap lat={location.latitude} long={location.longitude} />
          </div>
          <p className={s.address}>
            {location.physicalAddress.address1}
          </p>
        </div>
      }
      {organization.phones &&
        <div className={s.inset + ' ' + s.insetInGroup}>
          <label className={`${s.contactLabel} ${icons.iconPhone} icon-phone`}>Call </label>
            <div className={s.callPhone}>
               {organization.phones.map((phone, index) => (
                <div key={`phone-${index}`}>
                  <a
                    className={s.phone}
                    href={'tel:' + phone.number.replace(/[^\d]/g, '')}
                  >{phone.number}</a>
                  <span className={s.phoneDepartment}>{phone.department}</span>
                </div>
              ))}
            </div>
        </div>
      }
      {organization.url &&
        <div className={s.inset + ' ' + s.insetInGroup}>
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
      }
      <div className={s.inset + ' ' + s.insetInGroup}>
        <a
          href={getMapsUrl(location)}
          rel="nofollow"
          target="_blank"
        >
          <button>
            <label className={`${s.directionsLabel} ${icons.iconCompass} icon-compass`}>Directions</label>
          </button>
        </a>
      </div>
      <ul title="Services details" className={s.servicesList}>
        {services && Object.values(services).map((service, index) => (
          <li key={`service-${index}`} className={s.insetServices}>
            <div className={s.noteWrapper}>
              <h3 className={s.serviceTitle}>{service.name}</h3>
              <p className={s.serviceDescription}>{service.description}</p>
              <Schedule schedules={service.schedules} />
            </div>
            <div className={s.notes}>
              <label>Notes</label>
              <p>{service.applicationProcess}</p>
            </div>
            {service.eligibility.notes &&
              <div className={s.eligibility}>
                <label>Eligibility Notes</label>
                <p>{service.eligibility.notes}</p>
              </div>
            }
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Location
