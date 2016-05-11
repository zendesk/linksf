import React, { PropTypes } from 'react'
import './ServiceRow.scss'

const ServiceRow = (props) => (
  <li className="service">
      <a href="/" className="serviceLink" title={`Click to see more details about ${props.name}`}>
        <div>
          <div>
            <p className="serviceName">{props.name}</p>
          </div>
            <span className="serviceInfo">
              <span className="label-status open">open</span>
            </span>
          <div className="categoryIcons">
              <span><i className="category-icon icon-home"></i></span>
          </div>
          <span id="someidlater" className="label-status"></span>
          <div className="service-item-box-caret">
            <i className="icon-right-open-2 chevron"></i>
          </div>
        </div>
      </a>
    </li>
)

export default ServiceRow
