import React, { PropTypes } from 'react'
import s from './LocationEdit.css'
import icons from '../../icons/css/icons.css'

import ServiceEdit from '../ServiceEdit'

class LocationEdit extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      location: props.location,
    }
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleSubmit = (event)  => {
    // Do some stuff with firebase to login yee
  }

  render() {
    console.log(this.state.location)
    return (
      <div>
      <div className={s.editBox}>
        <div className={s.name}>
          <span className={s.nameLabel}>Location Name </span>
          <input
            type="text"
            value={this.state.location.name}
            onChange={this.handleChange}
          />
        </div>
        <div className={s.description}>
          <span className={s.descriptionLabel}>Location Description </span>
          <input
            type="text"
            value={this.state.location.description}
            onChange={this.handleChange}
          />
        </div>
        <div className={s.physicalAddressBox}>
          <div className={s.addressLineOne}>
            <span className={s.addressLineOneLabel}>Address </span>
            <input
              type="text"
              value={this.state.location.physical_address.address_1}
              onChange={this.handleChange}
            />
          </div>
          <div className={s.addressCity}>
            <span className={s.addressCityLabel}>City </span>
            <input
              type="text"
              value={this.state.location.physical_address.city}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className={s.servicesBox}>
          <span className={s.servicesBoxLabel}>Services </span>
          {(this.state.location.services || []).map((obj) => < ServiceEdit service={obj} changeState={this.handleChange} /> )}
        </div>
        <div className={s.loginSubmit}>
          <button type="button" onClick={this.handleSubmit}>Login</button>
        </div>
      </div>
      </div>
    )
  }
}

export default LocationEdit
