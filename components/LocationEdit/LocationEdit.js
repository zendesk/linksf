import React, { Component, PropTypes } from 'react'
import s from './LocationEdit.css'
import icons from '../../icons/css/icons.css'

import { uuid } from '../../lib/uuid'

import ServiceEdit from '../ServiceEdit'

const blankService = (location) => ({
  id: uuid(),
  applicationProcess: "",
  description: "",
  eligibility: {},
  locationId: location.id,
  name: "",
  organization: location.organizationId,
  schedules: [],
  taxonomy: ""
})

class LocationEdit extends Component {
   updateLocation = (field, value) => {
    const { index, location, handleChange } = this.props
    const newLocation = location

    newLocation[field] = value

    handleChange(newLocation, index)
  }

   deleteLocation = () => {
    const { index, handleDelete } = this.props

    handleDelete(index)
  }

   handleLocationChange = (field, event) => {
    this.updateLocation(field, event.target.value)
  }

   handleAddress = (field, event) => {
    const { physicalAddress } = this.props.location
    const newPhysicalAddress = physicalAddress

    newPhysicalAddress[field] = event.target.value

    this.updateLocation('physicalAddress', newPhysicalAddress)
  }

   handleServices = (newService, index) => {
    const { services } = this.props.location
    const newServices = services

    newServices[index] = newService

    this.updateLocation('services', newServices)
  }

   newService = () => {
    const { location } = this.props
    const newServices = location.services || []

    newServices.push(blankService(location))

    this.updateLocation('services', newServices)
  }

   deleteService = (index) => {
    const { services } = this.props.location
    const newServices = services

    newServices.splice(index, 1)

    this.updateLocation('services', newServices)
  }

  render() {
    const { location } = this.props

    return (
      <div className={s.locationEdit}>
        <div className={s.locationFields}>
          <h4 className={s.sectionLabel}>Location</h4>
          <div className={s.group}>
            <span className={s.nameLabel}>Location Name </span>
            <input
              className={s.input}
              type="text"
              value={location.name}
              onChange={(e) => this.handleLocationChange('name', e)}
            />
          </div>
          <div className={s.group}>
            <span className={s.descriptionLabel}>Location Description </span>
            <input
              className={s.input}
              type="text"
              value={location.description}
              onChange={(e) => this.handleLocationChange('description', e)}
            />
          </div>
          <div className={s.group}>
            <span className={s.addressLineOneLabel}>Street Address </span>
            <input
              className={s.input}
              type="text"
              value={location.physicalAddress.address1}
              onChange={(e) => this.handleAddress('address1', e)}
            />
          </div>
          <div className={s.group}>
            <span className={s.addressCityLabel}>City </span>
            <input
              className={s.input}
              type="text"
              value={location.physicalAddress.city}
              onChange={(e) => this.handleAddress('city', e)}
            />
          </div>
        </div>
        <button onClick={this.deleteLocation}>Delete</button>
        <div className={s.servicesBox}>
          <h4 className={s.sectionLabel}>Services</h4>
          {(location.services || []).map((service, index) => (
            <ServiceEdit
              key={`service-${index}`}
              service={service}
              index={index}
              handleChange={this.handleServices}
              handleDelete={this.deleteService} />
          ))}
          <button
            onClick={this.newService}
            title={`Click to add a new service`}>
            Add a Service
          </button>
        </div>
      </div>
    )
  }
}

export default LocationEdit
