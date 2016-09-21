import React, { PropTypes } from 'react'
import s from './OrganizationEdit.css'
import icons from '../../icons/css/icons.css'

import LocationEdit from '../LocationEdit'

import { fetchLocations } from '../../core/firebaseRestAPI'

class OrganizationEdit extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      organization: props.organization,
      locations: props.locations || []
    }
  }

  componentWillMount() {
    this.refreshLocations()
  }

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

  deleteOrganization = () => {
    this.props.handleDelete(this.props.index)
  }

  handleChange = (value, event) => {
    const { organization } = this.state
    const newOrganization = organization
    newOrganization[value] = event.target.value
    this.setState(Object.assign(this.state, { organization: newOrganization }))
  }

  handlePhones = (newPhone, index) => {
    const { phones } = this.state.organization
    const newPhones = phones
    newPhones[index] = newPhone
    this.setState(Object.assign(this.state, { phones: newPhones }))
  }

  blankPhone = () => {
    return {
      department: "",
      number: ""
    }
  }

  newPhone = () => {
    const { phones } = this.state.organization
    const newPhones = phones || []
    newPhones.push(this.blankPhone())
    this.setState(Object.assign(this.state, { phones: newPhones }))
  }

  deletePhone = (index) => {
    const { phones } = this.state.organization
    const newPhones = phones
    newPhones.splice(index, 1)
    this.setState(Object.assign(this.state, { phones: newPhones }))
  }

  handleLocations = (newLocation, index) => {
    const { locations } = this.state
    const newLocations = locations
    newLocations[index] = newLocation
    this.setState(Object.assign(this.state, { locations: newLocations }))
  }

  blankLocation = () => ({
    description: "",
    latitude: 0,
    longitude: 0,
    name: "",
    organizationId: this.state.organization.id || "",
    physicalAddress: {
      address1: "",
      city: ""
    }
  })

  newLocation = () => {
    const { locations } = this.state
    const newLocations = locations || []
    newLocations.push(this.blankLocation())
    this.setState(Object.assign(this.state, { locations: newLocations }))
  }

  deleteLocation = (index) => {
    const { locations } = this.state
    const newLocations = locations
    newLocations.splice(index, 1)
    this.setState(Object.assign(this.state, { locations: newLocations }))
  }

  handleSubmit = ()  => {
    this.props.handleUpdate(this.state.organization, this.state.locations)
    this.refreshLocations()
  }

  render() {
    return (
      <div className={s.organizationEditBox}>
        <button onClick={this.deleteOrganization}>Delete Organization</button>
        <div className={s.name}>
          <span className={s.nameLabel}>Organization Name </span>
          <input
            className={s.input}
            type="text"
            value={this.state.organization.name}
            onChange={(e) => this.handleChange('name', e)}
          />
        </div>
        <div className={s.description}>
          <span className={s.descriptionLabel}>Organization Description </span>
          <input
            className={s.input}
            type="text"
            value={this.state.organization.long_description}
            onChange={(e) => this.handleChange('long_description', e)}
          />
        </div>
        <div className={s.phonesBox}>
          <span className={s.phoneEditBoxLabel}>Phone Numbers </span>
          {(this.state.organization.phones || []).map((phone, index) => <PhoneEditBox key={`phone-${index}`} phone={phone} index={index} handleChange={this.handlePhones} handleDelete={this.deletePhone} /> )}
          <button onClick={this.newPhone} title={`Click to add a new phone`}>Add a Phone</button>
        </div>
        <div className={s.urlBox}>
          <span className={s.urlLabel}>Website </span>
          <input
            className={s.input}
            type="text"
            value={this.state.organization.url}
            onChange={(e) => this.handleChange('url', e)}
          />
        </div>
        <button onClick={this.newLocation} title={`Click to add a new location`}>Add a Location</button>
        <div className={s.locationsBox}>
          {(this.state.locations || []).map((loc, index) => <LocationEdit key={`location-${index}`} location={loc} index={index} handleChange={this.handleLocations} handleDelete={this.deleteLocation} />)}
        </div>
        <div className={s.formSubmit}>
          <button type="button" onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
    )
  }
}

const PhoneEditBox = (props) => {
  function updatePhone(value, event) {
    const { phone } = props
    const newPhone = phone
    newPhone[value] = event.target.value
    props.handleChange(newPhone, props.index)
  }

  function deletePhone() {
    props.handleDelete(props.index)
  }

  return (
    <div className={s.phoneEditBox}>
      <span className={s.phoneDepartmentLabel}>Department </span>
      <input
        className={s.input}
        type="text"
        value={props.phone.department}
        onChange={(e) => updatePhone('department', e)}
      />
      <span className={s.phoneNumberLabel}>Number </span>
      <input
        className={s.input}
        type="tel"
        value={props.phone.number}
        onChange={(e) => updatePhone('number', e)}
      />
      <button onClick={deletePhone}>Delete</button>
    </div>
  )
}

export default OrganizationEdit
