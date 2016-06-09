import React, { PropTypes } from 'react'
import './Service.scss'

import GoogleMap from '../GoogleMap'

const Service = (props) => {
  const { service } = props
  const { eligibility } = service
  return (
    <div className="service">
      <h2 className="title">Welcome</h2>
      <div className="inset">
        {eligibility.gender === 'F' ? 'Women' : 'Men'}
      </div>
      <h2 className="title">Services</h2>
      <div className="inset">
       {service.taxonomy}
      </div>
      <div className="inset-map">
        <div className="map">
          <GoogleMap />
        </div>
        <p className="address">{service.physicalAddress}</p>
      </div>
      <div className="inset-call">
        <label className="contact-label">Call </label>
        <span className="call-phone">{service.phone}</span>
      </div>
      <div className="inset-website">
        <label className="contact-label">Website </label>
        <span className="website-url">{service.url}</span>
      </div>
      <button className="inset-directions">
        <label className="directions-label">Directions</label>
      </button>
      <ul title="Services details" className="services-list">
        <li className="inset-services">
          <h3 className="service-title">Women's Shelter</h3>
          <p className="service-description">Shelter for youths. Don't stop being a great influence on society. We can read this now.</p>
          <table className="open-hours">
            <tbody>
              <tr>
                <td className="label-hour">
                  <b>Every day:</b>
                </td>
                <td className="hour">
                  24 Hours
                </td>
              </tr>
            </tbody>
          </table>
          <div className="notes">
            <label>Notes</label>
            <p>Youths 11-21 who are not on probation, call if you can or show up to be assessed for short-term housing. If accepted, they’ll contact your guardians within 24 hrs.</p>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default Service
