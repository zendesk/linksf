import React, { PropTypes } from 'react'
import s from './LocationEdit.css'
import icons from '../../icons/css/icons.css'

import ServiceEdit from '../ServiceEdit'

const LocationEdit = (props) => {
  const blankService = {
    application_process: "",
    description: "",
    eligibility: {},
    location_id: props.location.id,
    name: "",
    organization: props.location.organization_id,
    schedules: [],
    taxonomy: ""
  }

  function updateLocation(field, value) {
    const { location } = props
    const newLocation = location
    newLocation[field] = value
    props.handleChange(newLocation, props.index)
  }

  function deleteLocation() {
    props.handleDelete(props.index)
  }

  function handleLocationChange(field, event) {
    updateLocation(field, event.target.value)
  }

  function handleAddress(field, event) {
    const { physical_address } = props.location
    const newPhysicalAddress = physical_address
    newPhysicalAddress[field] = event.target.value
    updateLocation('physical_address', newPhysicalAddress)
  }

  function handleServices(newService, index) {
    const { services } = props.location
    const newServices = services
    newServices[index] = newService
    updateLocation('services', newServices)
  }

  function newService() {
    const { services } = props.location
    const newServices = services || []
    newServices.push(blankService)
    updateLocation('services', newServices)
  }

  function deleteService(index) {
    const { services } = props.location
    const newServices = services
    newServices.splice(index, 1)
    updateLocation('services', newServices)
  }

  return (
    <div className={s.locationEdit}>
      <div className={s.locationFields}>
        <h4 className={s.sectionLabel}>Location</h4>
        <div className={s.group}>
          <span className={s.nameLabel}>Location Name </span>
          <input
            className={s.input}
            type="text"
            value={props.location.name}
            onChange={(e) => handleLocationChange('name', e)}
          />
        </div>
        <div className={s.group}>
          <span className={s.descriptionLabel}>Location Description </span>
          <input
            className={s.input}
            type="text"
            value={props.location.description}
            onChange={(e) => handleLocationChange('description', e)}
          />
        </div>
        <div className={s.group}>
          <span className={s.addressLineOneLabel}>Street Address </span>
          <input
            className={s.input}
            type="text"
            value={props.location.physical_address.address_1}
            onChange={(e) => handleAddress('address_1', e)}
          />
        </div>
        <div className={s.group}>
          <span className={s.addressCityLabel}>City </span>
          <input
            className={s.input}
            type="text"
            value={props.location.physical_address.city}
            onChange={(e) => handleAddress('city', e)}
          />
        </div>
      </div>
      <button onClick={deleteLocation}>Delete</button>
      <div className={s.servicesBox}>
        <h4 className={s.sectionLabel}>Services</h4>
        {(props.location.services || []).map((service, index) => <ServiceEdit key={`service-${index}`}service={service} index={index} handleChange={handleServices} handleDelete={deleteService} /> )}
        <button onClick={newService} title={`Click to add a new service`}>Add a Service</button>
      </div>
    </div>
  )
}

export default LocationEdit
