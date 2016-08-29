import React, { PropTypes } from 'react'
import s from './LocationEdit.css'
import icons from '../../icons/css/icons.css'

import ServiceEdit from '../ServiceEdit'

class LocationEdit extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      location: props.location
    }
  }

  handleInput = (field, event) => {
    const { location } = this.state
    const newLocation = location
    newLocation[field] = event.target.value
    this.setState(Object.assign(this.state, { location: newLocation }))
  }

  handleAddress = (field, event) => {
    const { physical_address } = this.state.location
    const new_physical_address = physical_address
    new_physical_address[field] = event.target.value
    this.setState(Object.assign(this.state, { physical_address: new_physical_address }))
  }

  handleService = (new_service, index) => {
    const { services } = this.state.location
    const newServices = services
    newServices[index] = new_service
    this.setState(Object.assign(this.state, { services: newServices }))
  }

  handleSubmit = (event)  => {
    // Do some stuff with firebase to login yee
  }

  render() {
    return (
      <div className={s.locationEdit}>
        <div className={s.locationFields}>
          <h4 className={s.sectionLabel}>Location</h4>
          <div className={s.group}>
            <span className={s.nameLabel}>Location Name </span>
            <input
              className={s.input}
              type="text"
              value={this.state.location.name}
              onChange={(e) => this.handleInput('name', e)}
            />
          </div>
          <div className={s.group}>
            <span className={s.descriptionLabel}>Location Description </span>
            <input
              className={s.input}
              type="text"
              value={this.state.location.description}
              onChange={(e) => this.handleInput('description', e)}
            />
          </div>
          <div className={s.group}>
            <span className={s.addressLineOneLabel}>Street Address </span>
            <input
              className={s.input}
              type="text"
              value={this.state.location.physical_address.address_1}
              onChange={(e) => this.handleAddress('address_1', e)}
            />
          </div>
          <div className={s.group}>
            <span className={s.addressCityLabel}>City </span>
            <input
              className={s.input}
              type="text"
              value={this.state.location.physical_address.city}
              onChange={(e) => this.handleAddress('city', e)}
            />
          </div>
        </div>
        <div className={s.servicesBox}>
          <h4 className={s.sectionLabel}>Services</h4>
          {(this.state.location.services || []).map((service, index) => <ServiceEdit service={service} index={index} handleChange={this.handleService} /> )}
        </div>
        <div className={s.submit}>
          <button
            className={s.submitBtn}
            type="submit"
            onClick={this.handleSubmit}>Submit
          </button>
        </div>
      </div>
    )
  }
}

export default LocationEdit
