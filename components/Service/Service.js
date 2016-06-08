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
          <GoogleMap />
          <p className="address">1049 Howard St</p>
        </div>

      </div>
    )
}

export default Service
