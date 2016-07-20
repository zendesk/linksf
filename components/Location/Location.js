import React, { PropTypes } from 'react'
import s from './Location.css'

import GoogleMap from '../GoogleMap'

const Location = (props) => {
  const { location } = props
  const { services } = location
  return (
    <div className={s.location}>
      <h2 className={s.title}>Welcome</h2>
      <div className={s.inset}>
        {/*{eligibility.gender === 'F' ? 'Women' : 'Men'}*/}
        Women
      </div>
      <h2 className={s.title}>Locations</h2>
      <div className={s.inset}>
       Some categories
      </div>
      <div className={s.insetMap}>
        <div className={s.map}>
          <GoogleMap />
        </div>
        <p className={s.address}>
        {/*{location.physicalAddress}*/}
        </p>
      </div>
      <div className={s.insetCall}>
        <label className={s.contactLabel}>Call </label>
        <span className={s.callPhone}>
          {/*{location.organization.phone}*/}
          867-5309
        </span>
      </div>
      <div className={s.insetWebsite}>
        <label className={s.contactLabel}>Website </label>
        <span className={s.websiteUrl}>
          {/*{service.url}*/}
        </span>
      </div>
      <button className={s.insetDirections}>
        <label className={s.directionsLabel}>Directions</label>
      </button>
      <ul title="Services details" className={s.servicesList}>
        {services.map(service => (
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
              <p>{service.applicationProcess}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Location
