import React, { PropTypes } from 'react'
import './Service.scss'

const Service = (props) => {
  const { service } = props
    return (
      <div>
        <div className="inset">
          {service.name}
        </div>
        {service.description}
      </div>
    )
  }

export default Service
