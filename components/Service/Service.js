import React, { PropTypes } from 'react'
import s from './Service.css'

import GoogleMap from '../GoogleMap'

const Service = (props) => {
  const { service } = props
  const { eligibility } = service
  return (
    <div className={s.service}>
      <h2 className={s.title}>Welcome</h2>
      <div className={s.inset}>
        {eligibility.gender === 'F' ? 'Women' : 'Men'}
      </div>
      <h2 className={s.title}>Services</h2>
      <div className={s.inset}>
       {service.taxonomy}
      </div>
      <div className={s.insetMap}>
        <div className={s.map}>
          <GoogleMap />
        </div>
        <p className={s.address}>{service.physicalAddress}</p>
      </div>
      <div className={s.insetCall}>
        <label className={s.contactLabel}>Call </label>
        <span className={s.callPhone}>{service.phone}</span>
      </div>
      <div className={s.insetWebsite}>
        <label className={s.contactLabel}>Website </label>
        <span className={s.websiteUrl}>{service.url}</span>
      </div>
      <button className={s.insetDirections}>
        <label className={s.directionsLabel}>Directions</label>
      </button>
      <ul title="Services details" className={s.servicesList}>
        <li className={s.insetServices}>
          <h3 className={s.serviceTitle}>{service.name}</h3>
          <p className={s.serviceDescription}>{service.description}</p>
          <table className={s.openHours}>
            <tbody>
              <tr>
                <td className={s.labelHour}>
                  <b>Every day:</b>
                </td>
                <td className={s.hour}>
                  24 Hours
                </td>
              </tr>
            </tbody>
          </table>
          <div className={s.notes}>
            <label>Notes</label>
            <p>Youths 11-21 who are not on probation, call if you can or show up to be assessed for short-term housing. If accepted, they’ll contact your guardians within 24 hrs.</p>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default Service
