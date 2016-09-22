import React, { Component, PropTypes } from 'react'
import s from './OrganizationEdit.css'
import icons from '../../icons/css/icons.css'

import { redirectTo } from '../../lib/navigation'
import { uuid } from '../../lib/uuid'
import {
  fetchLocations,
  updateLocation,
  deleteLocation,
  updateOrganization,
  deleteOrganization
} from '../../core/firebaseRestAPI'

import LocationEdit from '../LocationEdit'
import PhoneEdit from '../PhoneEdit'

const blankPhone = {
  department: "",
  number: ""
}

const blankLocation = (organization) => ({
  id: uuid(),
  description: "",
  latitude: 0,
  longitude: 0,
  name: "",
  organizationId: organization.id || "",
  physicalAddress: {
    address1: "",
    city: ""
  }
})

class OrganizationEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      organization: props.organization,
      locations: []
    }
  }

  componentWillMount() {
    this.refreshLocations()
  }

  //TODO: only fetch locations for org rather than filter them down after
  refreshLocations = () => {
    const { organization } = this.state

    fetchLocations()
      .then(locations => (
        locations.filter(location => (
          location.organizationId == organization.id
        ))
      ))
      .then(locations => {
        this.setState({ locations })
      })
  }

  handleDeleteOrganization = () => {
    const { organization } = this.state
    const answer = confirm(`Are you sure you want to delete ${organization.name}? You cannot undo this or recover the data.`)

    if (answer) {
      handleDeleteOrganization(organization.id)
        .then(redirectTo('/admin'))
    }
  }

  // Updates our representation of the organization in the state
  handleChange = (property, event) => {
    const { organization } = this.state
    const newOrganization = organization

    newOrganization[property] = event.target.value

    this.setState({ organization: newOrganization })
  }

  handlePhones = (newPhone, index) => {
    const { phones } = this.state.organization
    const newPhones = phones

    newPhones[index] = newPhone

    this.setState({ phones: newPhones })
  }

  newPhone = () => {
    const { phones } = this.state.organization
    const newPhones = phones || []

    newPhones.push(blankPhone)

    this.setState({ phones: newPhones })
  }

  deletePhone = (index) => {
    const { phones } = this.state.organization
    const newPhones = phones

    newPhones.splice(index, 1)

    this.setState({ phones: newPhones })
  }

  handleLocations = (newLocation, index) => {
    const { locations } = this.state
    const newLocations = locations

    newLocations[index] = newLocation

    this.setState({ locations: newLocations })
  }

  newLocation = () => {
    const { organization, locations } = this.state
    const newLocations = locations || []

    newLocations.push(blankLocation(organization))

    this.setState({ locations: newLocations })
  }

  handleDeleteLocation = (index) => {
    const { locations } = this.state
    const location = locations[index]
    const answer = confirm(`Are you sure you want to delete the location: ${location.name}? You cannot undo this or recover the data.`)

    if (!answer) {
      return
    }

    deleteLocation(location.id)
      .then(_res => {
        const newLocations = locations

        newLocations.splice(index, 1)
        this.setState({ locations: newLocations })
      })
  }

  handleSubmit = ()  => {
    const { organization, locations } = this.state

    updateOrganization(organization)

    locations.map(location => {
      updateLocation(location)
    })
  }

  render() {
    const { organization } = this.state

    return (
      <div className={s.organizationEditBox}>
        <button onClick={this.handleDeleteOrganization}>Delete Organization</button>
        <div className={s.name}>
          <span className={s.nameLabel}>Organization Name </span>
          <input
            className={s.input}
            type="text"
            value={organization.name}
            onChange={(e) => this.handleChange('name', e)}
          />
        </div>
        <div className={s.description}>
          <span className={s.descriptionLabel}>Organization Description </span>
          <input
            className={s.input}
            type="text"
            value={organization.long_description}
            onChange={(e) => this.handleChange('longDescription', e)}
          />
        </div>
        <div className={s.phonesBox}>
          <span className={s.phoneEditBoxLabel}>Phone Numbers </span>
          {(organization.phones || []).map((phone, index) => (
            <PhoneEdit
              key={`phone-${index}`}
              phone={phone}
              index={index}
              handleChange={this.handlePhones}
              handleDelete={this.deletePhone} />
          ))}
          <button
            onClick={this.newPhone}
            title={`Click to add a new phone`}>
            Add a Phone
          </button>
        </div>
        <div className={s.urlBox}>
          <span className={s.urlLabel}>Website </span>
          <input
            className={s.input}
            type="text"
            value={organization.url}
            onChange={(e) => this.handleChange('url', e)}
          />
        </div>
        <button
          onClick={this.newLocation}
          title={`Click to add a new location`}>
          Add a Location
        </button>
        <div className={s.locationsBox}>
          {(this.state.locations || []).map((loc, index) => (
            <LocationEdit
              key={`location-${index}`}
              location={loc}
              index={index}
              handleChange={this.handleLocations}
              handleDelete={this.handleDeleteLocation} />
          ))}
        </div>
        <div className={s.formSubmit}>
          <button type="button" onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
    )
  }
}

export default OrganizationEdit
