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

const placeholderAddressText = (physicalAddress) => {
  if (physicalAddress.address1) {
    return physicalAddress.address1 + ", " + physicalAddress.city;
  } else {
    return "Search for location"
  }
}

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
    this.selectService(null)
  }

  selectService = (service) => {
    this.props.handleStateUpdate({ selectedService: service })
  }

  serviceSelected = (service) => {
    return this.props.selectedService && this.props.selectedService.id == service.id
  }

  render() {
    const { location, selectedService, taxonomies } = this.props

    return (
      <div className={s.locationEditBox}>
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
        </div>
        <div className={s.inputBox}>
          <div className={s.inputGroup}>
            <span className={s.inputLabel}>Location Description</span>
            <textarea
              className={s.input}
              type="text"
              value={location.description}
              onChange={(e) => this.handleLocationChange('description', e)}
            />
          </div>
        </div>
        <div className={s.inputBox}>
          <div className={s.inputGroup}>
            <span className={s.inputLabel}>Location Address</span>
            <Autocomplete
              placeholder={placeholderAddressText(location.physicalAddress)}
              className={s.input}
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
            <span className={s.inputLabel}>City</span>
            <input
              className={s.input}
              type="text"
              value={location.physicalAddress.city}
              disabled
            />
          </div>
        </div>
        <div className={s.inputGroup}>
          <button className={s.buttonStyle} onClick={this.deleteLocation}>Delete this Location</button>
        </div>
        <div className={s.servicesEditBox}>
          <div className={s.subsectionLabel}>
            Services
            <button
              className={s.addToSubsection}
              onClick={this.newService}
              title={`Click to add a new service`}>
              + Add
            </button>
          </div>
          <div className={s.servicesList}>
            {(Object.values(location.services || {})).map((service) => (
              <ToggleButton
                key={`service-${service.id}`}
                enabled={this.serviceSelected(service)}
                onClick={(e) => this.selectService(service)}
                label={service.name || "Service"}
              />
            ))}
          </div>

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
