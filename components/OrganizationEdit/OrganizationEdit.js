import React, { PropTypes } from 'react'
import s from './OrganizationEdit.css'
import icons from '../../icons/css/icons.css'

import LocationEdit from '../LocationEdit'

import { fetchLocationsForOrganization } from '../../core/firebaseApi'

class OrganizationEdit extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      organization: props.organization,
      locations: null
    }
  }

  componentWillMount() {
    fetchLocationsForOrganization(this.state.organization.id)
      .then(locations => {
        console.log(locations)
        this.setState({ locations })
      })
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleLocations = (newLocation, index) => {
    const { locations } = this.state
    const newLocations = locations
    newLocations[index] = newLocation
    this.setState(Object.assign(this.state, { locations: newLocations }))
  }

  handleSubmit = (event)  => {
    // Do some stuff with firebase to login yee
  }

  render() {
    console.log(this.state)
    return (
      <div className={s.organizationEditBox}>
        <div className={s.name}>
          <span className={s.nameLabel}>Organization Name </span>
          <input
            type="text"
            value={this.state.organization.name}
            onChange={this.handleChange}
          />
        </div>
        <div className={s.description}>
          <span className={s.descriptionLabel}>Organization Description </span>
          <input
            type="text"
            value={this.state.organization.long_description}
            onChange={this.handleChange}
          />
        </div>
        <div className={s.phonesBox}>
          <span className={s.phoneEditBoxLabel}>Phone Numbers </span>
          {(this.state.organization.phones || []).map((obj) => <PhoneEditBox key={`phone-${obj}`} phone={obj} changeState={this.handleChange} /> )}
          <p><a>Add a phone number</a>  TODO</p>
        </div>
        <div className={s.urlBox}>
          <span className={s.urlLabel}>Website </span>
          <input
            type="text"
            value={this.state.organization.url}
            onChange={this.handleChange}
          />
        </div>
        <div className={s.locationsBox}>
          {(this.state.locations || []).map((loc, index) => <LocationEdit key={`location-${loc.id}`} location={loc} handleChange={this.handleLocations} index={index} />)}
        </div>
        <div className={s.loginSubmit}>
          <button type="button" onClick={this.handleSubmit}>Login</button>
        </div>
      </div>
    )
  }
}

const PhoneEditBox = (props) => (
   <div className={s.phoneEditBox}>
     <span className={s.phoneDepartmentLabel}>Department </span>
     <input
       type="text"
       value={props.phone.department}
       onChange={props.phone.changeState}
     />
     <span className={s.phoneNumberLabel}>Number </span>
     <input
       type="text"
       value={props.phone.number}
       onChange={props.changeState}
     />
   </div>
 )

export default OrganizationEdit
