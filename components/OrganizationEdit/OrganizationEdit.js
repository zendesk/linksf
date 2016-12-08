import React, { Component, PropTypes } from 'react'
import R from 'ramda'
import s from './OrganizationEdit.css'
import icons from '../../icons/css/icons.css'
import history from '../../core/history'

import { taxonomiesWithIcons } from '../../lib/taxonomies'
import { redirectTo } from '../../lib/navigation'
import { uuid } from '../../lib/uuid'
import {
  fetchLocations,
  updateLocation,
  deleteLocation,
  updateOrganization,
  deleteOrganization,
  fetchTaxonomies
} from '../../core/firebaseRestAPI'

import LocationEdit from '../LocationEdit'
import ToggleButton from '../ToggleButton'
import PhoneEdit from '../PhoneEdit'

const changesMessage = "There are unsaved changes. Are you sure you want to discard them?"

const blankPhone = () => ({
  department: "",
  number: ""
})

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
    const tempProps = Object.assign({}, props)

    super(props)
    this.state = {
      changesExist: false,
      organization: tempProps.organization,
      locations: [],
      selectedLocation: null,
      selectedService: null
    }
  }

  componentDidMount() {
    this.refreshLocations()
    this.refreshTaxonomies()
    const currentLocation = window.location.pathname

    history.listenBeforeUnload(_ => (this.state.changesExist ? changesMessage : null))

    // If there are changes and the user tries to click the back button, so we
    // prompt them if it is okay. The caveat is that regardless of the users
    // answer, the history stack and URL have already been modified. So if we
    // are executing the back action (action == POP), then push the current page
    // back onto the stack, otherwise proceed as normal.
    history.listenBefore((location, callback) => {
      if (location.action === "POP" && this.state.changesExist) {
        if (confirm(changesMessage)) {
          callback()
        } else {
          history.push(currentLocation)
        }
      } else {
        callback()
      }
    })
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

  refreshTaxonomies = () => {
    fetchTaxonomies()
      .then(taxonomies => {
        this.setState({
          taxonomies: taxonomiesWithIcons(taxonomies)
        })
      })
  }

  handleDeleteOrganization = () => {
    const { organization } = this.state
    const answer = confirm(`Are you sure you want to delete ${organization.name}? You cannot undo this or recover the data.`)

    if (answer) {
      deleteOrganization(organization.id)
        .then(redirectTo('/admin'))
    }
  }

  // Updates our representation of the organization in the state
  handleChange = (property, event) => {
    const { organization } = this.state
    const newOrganization = {}

    newOrganization[property] = event.target.value

    const updatedOrganization = R.merge(organization, newOrganization)

    this.setState({
      organization: updatedOrganization,
      changesExist: true,
    })
  }

  handlePhones = (property, newValue, index) => {
    const { organization } = this.state

    const newPhone = {}
    newPhone[property] = newValue

    const newPhones = [...organization.phones]
    newPhones[index] = R.merge(newPhones[index], newPhone)

    const newOrganization = {}
    newOrganization.phones = newPhones

    const updatedOrganization = R.merge(organization, newOrganization)

    this.setState({
      organization: updatedOrganization,
      changesExist: true,
    })
  }

  newPhone = () => {
    const { organization } = this.state
    const newPhones = [...organization.phones]
    const newOrganization = {}

    newPhones.push(blankPhone())
    newOrganization.phones = newPhones

    const updatedOrganization = R.merge(organization, newOrganization)

    this.setState({ organization: updatedOrganization })
  }

  deletePhone = (index) => {
    const { organization } = this.state
    const newPhones = [...organization.phones]
    const newOrganization = {}

    newPhones.splice(index, 1)
    newOrganization.phones = newPhones

    const updatedOrganization = R.merge(organization, newOrganization)

    this.setState({
      organization: newOrganization,
      changesExist: true,
    })
  }

  handleStateUpdate = (update) => {
    this.setState(update)
  }

  handleLocations = (newLocation, index) => {
    const { locations } = this.state
    const newLocations = [...locations]

    newLocations[index] = newLocation

    this.setState({
      locations: newLocations,
      changesExist: true,
    })
  }

  newLocation = () => {
    const { organization, locations } = this.state
    const newLocations = [...locations]

    const newLocation = blankLocation(organization)
    newLocations.push(newLocation)

    this.setState({
      locations: newLocations,
      selectedLocation: newLocation,
      selectedService: null,
    })
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
        const newLocations = [...locations]

        newLocations.splice(index, 1)
        this.setState({
          locations: newLocations,
          changesExist: true,
        })
      })
  }

  handleSubmit = ()  => {
    const { organization, locations } = this.state

    updateOrganization(organization)

    locations.map(location => {
      updateLocation(location)
    })
  }

  handleReset = () => {
    const { organization } = this.props

    this.setState({
      organization,
      locations: [],
      selectedLocation: null,
      selectedService: null,
      changesExist: false,
    }, _ => {
      this.refreshLocations()
      this.refreshTaxonomies()
    })
  }

  selectLocation = (location) => {
    this.setState({
      selectedLocation: location,
      selectedService: null,
    })
  }

  locationSelected = (location) => {
    return this.state.selectedLocation && this.state.selectedLocation.id == location.id
  }

  render() {
    const {
      organization,
      locations,
      selectedLocation,
      selectedService,
      taxonomies
    } = this.state

    return (
      <div className={s.organizationEditBox}>
        <h2>{ organization.name || 'New Organization' }</h2>

        <div className={s.baseOrganizationProperties}>
          <div className={s.baseOrganizationItem}>
            <div className={s.mainInputGroup}>
              <span className={s.mainLabel}>Name </span>
              <input
                className={s.input}
                type="text"
                value={organization.name}
                onChange={(e) => this.handleChange('name', e)}
              />
            </div>
            <div className={s.mainInputGroup}>
              <span className={s.mainLabel}>Website </span>
              <input
                className={s.input}
                type="text"
                value={organization.url}
                onChange={(e) => this.handleChange('url', e)}
              />
            </div>
            <div className={s.mainInputGroup}>
              <span className={s.mainLabel}>Description </span>
              <textarea
                className={s.input + ' ' + s.description}
                value={organization.longDescription}
                onChange={(e) => this.handleChange('longDescription', e)}
              />
            </div>
          </div>
        </div>

        <div className={s.subsectionLabel}>
          Phone Numbers
          <button
            className={s.addToSubsection}
            onClick={this.newPhone}
            title={`Click to add a new phone`}>
            + Add
          </button>
        </div>
        <div className={s.phonesBox}>
          {organization.phones.map((phone, index) => (
            <PhoneEdit
              key={`phone-${index}`}
              phone={phone}
              index={index}
              handleChange={this.handlePhones}
              handleDelete={this.deletePhone} />
          ))}
        </div>
        <div className={s.locationsEditBox}>
          <div className={s.subsectionLabel}>
            Locations
            <button
              className={s.addToSubsection}
              onClick={this.newLocation}
              title={`Click to add a new location`}>
              + Add
            </button>
          </div>
          <div className={s.locationsList}>
            {locations.map((location) => (
              <ToggleButton
                key={`location-${location.id}`}
                enabled={this.locationSelected(location)}
                onClick={(e) => this.selectLocation(location)}
                label={location.name || "Location"}
              />
            ))}
          </div>

          <div className={s.locationEdit}>
            {selectedLocation ? <LocationEdit
                  location={selectedLocation}
                  selectedService={selectedService}
                  handleStateUpdate={this.handleStateUpdate}
                  handleChange={this.handleLocations}
                  handleDelete={this.handleDeleteLocation}
                  taxonomies={taxonomies}
                /> : null}
          </div>
        </div>

        <div className={s.formSubmit}>
          <button className={`${s.buttonStyle} ${s.submitButton}`} onClick={this.handleSubmit}>Submit</button>
          <button className={s.buttonStyle} onClick={this.handleReset}>Reset</button>
          <button className={`${s.buttonStyle} ${s.deleteButton}`} onClick={this.handleDeleteOrganization}>Delete this Organization</button>
        </div>
      </div>
    )
  }
}

export default OrganizationEdit
