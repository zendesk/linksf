import React, { PropTypes } from 'react'
import './ServiceRow.scss'

import Link from '../Link'
import ServiceStatus from '../ServiceStatus'

const ServiceRow = (props) => (
  <li className="service">
      <Link to={`/services/detail/${props.id}`} className="serviceLink" title={`Click to see more details about ${props.name}`}>
        <div>
          <div>
            <p className="serviceName">{props.name}</p>
          </div>
            <span className="serviceInfo">
              <ServiceStatus schedules={props.regularSchedules} />
            </span>
          <div className="categoryIcons">
              <span><i className="category-icon icon-home"></i></span>
          </div>
          <span id="someidlater" className="label-status"></span>
          <div className="service-item-box-caret">
            <i className="icon-right-open-2 chevron"></i>
          </div>
        </div>
      </Link>
    </li>
)

export default ServiceRow
