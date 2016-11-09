import React, { Component, PropTypes } from 'react'
import s from './LocationEdit.css'
import icons from '../../icons/css/icons.css'

import { uuid } from '../../lib/uuid'

import ServiceEdit from '../ServiceEdit'
import ToggleButton from '../ToggleButton'
import Autocomplete from 'react-google-autocomplete'

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

   handleAddress = (place) => {
    const { physicalAddress } = this.props.location
    const newPhysicalAddress = physicalAddress

    newPhysicalAddress['address1'] = place.name
    newPhysicalAddress['city'] = place.vicinity

    this.updateLocation('physicalAddress', newPhysicalAddress)
    this.updateLocation('latitude', place.geometry.location.lat())
    this.updateLocation('longitude', place.geometry.location.lng())
  }

   handleServices = (service) => {
    const { services } = this.props.location
    const newServices = services

    newServices[service.id] = service

    this.updateLocation('services', newServices)
  }

   newService = () => {
    const { location } = this.props
    const newServices = location.services || []
    const newService = blankService(location)

    newServices[newService.id] = newService

    this.updateLocation('services', newServices)
    this.selectService(newService)
  }

   deleteService = (service) => {
    const { services } = this.props.location
    const newServices = services

    delete newServices[service.id]

    this.updateLocation('services', newServices)
  }

  selectService = (service) => {
    this.props.handleStateUpdate({ selectedService: service })
  }

  serviceSelected = (service) => {
    return this.props.selectedService.id == service.id
  }

  render() {
    const { location, selectedService, taxonomies } = this.props

    return (
      <div className={s.locationEditBox}>
        <h4 className={s.sectionLabel}>Location</h4>
        <div className={s.inputBox}>
          <div className={s.inputGroup}>
            <span className={s.inputLabel}>Location Name </span>
            <input
              className={s.input}
              type="text"
              value={location.name}
              onChange={(e) => this.handleLocationChange('name', e)}
            />
          </div>
          <div className={s.inputGroup}>
            <span className={s.inputLabel}>Location Description</span>
            <input
              className={s.input}
              type="text"
              value={location.description}
              onChange={(e) => this.handleLocationChange('description', e)}
            />
          </div>
          <div className={s.inputGroup}>
            <span className={s.inputLabel}>Street Address</span>
            <Autocomplete
              style={{width: '90%'}}
              onPlaceSelected={this.handleAddress}
              types={['geocode']}
            />
          </div>
          <div className={s.inputGroup}>
            <span className={s.inputLabel}>Street</span>
            <input
              className={s.input}
              type="text"
              value={location.physicalAddress.address1}
              disabled
            />
          </div>
          <div className={s.inputGroup}>
            <span className={s.inputLabel}>City </span>
            <input
              className={s.input}
              type="text"
              value={location.physicalAddress.city}
              disabled
            />
          </div>
        </div>
        <button className={s.buttonStyle} onClick={this.deleteLocation}>Delete</button>
        <div className={s.servicesEditBox}>
          <h4 className={s.sectionLabel}>Services</h4>
          <div className={s.servicesList}>
            {(Object.values(location.services || {})).map((service) => (
              <ToggleButton 
                key={`service-${service.id}`}
                enabled={this.serviceSelected(service)}
                onClick={(e) => this.selectService(service)}
                label={service.name || "New Service"}
              />
            ))}
          </div>
          <button
            className={s.addToSubsection}
            onClick={this.newService}
            title={`Click to add a new service`}>
            + Add
          </button>
          <div className={s.serviceEdit}>
            {selectedService && 
              <ServiceEdit
                key={`service-${selectedService.id}`}
                service={selectedService}
                handleChange={this.handleServices}
                handleDelete={this.deleteService} 
                taxonomies={taxonomies}
              />
            }
          </div>
        </div>
      </div>
    )
  }
}

export default LocationEdit
