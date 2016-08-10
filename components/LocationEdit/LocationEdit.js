import React, { PropTypes } from 'react'
import s from './LocationEdit.css'
import icons from '../../icons/css/icons.css'

import ServiceStatus from '../ServiceStatus'

class LocationEdit extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      location: props.location,
    }
  }

  render() {
    return (
      <div>
        HEYYYYYY BAYBAY
      </div>
    )
  }
}

export default LocationEdit
