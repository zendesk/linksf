import React, { PropTypes } from 'react'
import './Service.scss'

import GoogleMap from '../GoogleMap'

const Service = (props) => {
  const { service } = props
    return (
      <div className="service">
        <h2 className="title">Welcome</h2>
        <div className="inset">
          Womens
        </div>
        <h2 className="title">Services</h2>
        <div className="inset">
         Shelter
        </div>
        <div className="inset-map">
          <div className="map">
            <GoogleMap />
          </div>
          <p className="address">1049 Howard St</p>
        </div>
        <div className="inset-call">
          <label className="contact-label">Call </label>
          <span>867-5309</span>
        </div>
        <div className="inset-website">
          <label className="contact-label">Website</label> http://www.zendesk.com
        </div>
        <div className="inset-directions">
          <label className="contact-label">Directions</label>
        </div>
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
