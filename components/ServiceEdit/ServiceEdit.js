import React, { Component } from 'react'
import s from './ServiceEdit.css'
import icons from '../../icons/css/icons.css'
import { gender } from '../../lib/eligibilities'
import { age } from '../../lib/eligibilities'
import TimeRangePicker from '../TimeRangePicker'
import ToggleButton from '../ToggleButton'

class ServiceEdit extends Component {
  updateService = (field, value) => {
    const { service, handleChange } = this.props
    const newService = service

    newService[field] = value
    handleChange(newService)
  }

  deleteService = () => {
    const { service, handleDelete } = this.props

    handleDelete(service)
  }

  handleServiceChange = (field, event) => {
    this.updateService(field, event.target.value)
  }

  handleGender = (value) => {
    const { eligibility } = this.props.service
    const newEligibility = eligibility

    newEligibility.gender = value.key
    this.updateService('eligibility', newEligibility)
  }

  handleAge = (value) => {
    const { eligibility } = this.props.service
    const newEligibility = eligibility
    let newAge = newEligibility.age || ''

    if (newAge.includes(value.key)) {
      newAge = newAge.replace(value.key, '')
    } else {
      newAge = newAge + value.key
    }

    newEligibility.age = newAge
    this.updateService('eligibility', newEligibility)
  }

  getAgeClass = (value) => {
    let classes = [s.selectableButton]
    const { eligibility } = this.props.service
    let stateVal = eligibility ? (eligibility.age || '') : ''

    return stateVal.includes(value.key)
  }

  getGenderClass = (value) => {
    let classes = [s.selectableButton]
    const { eligibility } = this.props.service
    let stateVal = eligibility ? eligibility.gender : ''

    return stateVal == value.key
  }

  getCategoryClass = (value) => {
    let classes = [s.selectableButton]
    const { taxonomy } = this.props.service

    return taxonomy.toLowerCase() == value
  }

  handleTimeChange = (event, start_or_end, metadata) => {
    const { schedules } = this.props.service
    const newSchedules = schedules

    if (start_or_end == 'start') {
      newSchedules[metadata.scheduleNum][metadata.day]['opens_at'] = event.target.value.replace(':', '')
    } else {
      newSchedules[metadata.scheduleNum][metadata.day]['closes_at'] = event.target.value.replace(':', '')
    }

    updateService('schedules', newSchedules)
  }

  render() {
    const { service, taxonomies } = this.props

    return (
      <div className={s.serviceEditBox}>
        <h4 className={s.sectionLabel}>Service</h4>
        <div className={s.name}>
          <span className={s.nameLabel}>Service Name </span>
          <input
            type="text"
            value={service.name}
            onChange={(e) => this.handleServiceChange('name', e)}
          />
        </div>
        <div className={s.descriptionBox}>
          <span className={s.descriptionLabel}>Service Description </span>
          <input
            type="text"
            value={service.description}
            onChange={(e) => this.handleServiceChange('description', e)}
          />
        </div>
        <div className={s.applicationBox}>
          <span className={s.applicationLabel}>Application Process </span>
          <input
            type="text"
            value={service.applicationProcess}
            onChange={(e) => this.handleServiceChange('applicationProcess', e)}
          />
        </div>
        <div className={s.elegibilityBox}>
          <span className={s.eligibilityLabel}>Elegibility Information </span>
          <GenderBox
            gender={service.eligibility && service.eligibility.gender}
            getGenderClass={this.getGenderClass}
            handleGender={this.handleGender}/>
          <AgeBox
            getAgeClass={this.getAgeClass}
            handleAge={this.handleAge} />
        </div>
        <div className={s.schedulesBox}>
          <span className={s.schedulesLabel}>Schedule </span>
          {(service.schedules || []).map((schedule, index) => (
            <ScheduleBox
              key={`schedule-${index}`}
              index={index}
              schedule={schedule}
              handleTimeChange={this.handleTimeChange} />
          ))}
        </div>
        <div className={s.taxonomyBox}>
          <span className={s.taxonomyLabel}>Category </span>
          {(taxonomies).map((category, i) => (
            <ToggleButton
              key={`category-${i}`}
              enabled={this.getCategoryClass(category.name.toLowerCase())}
              extraClasses={`${s.categoryIcon} ${category.icon}`}
              onClick={(e) => this.updateService('taxonomy', category.name.toLowerCase())}
              label={category.name}
            />
          ))}
        </div>
        <div className={s.deleteBox}>
          <button
            className={s.deleteButton}
            onClick={this.deleteService}
          >
          Delete
          </button>
        </div>
      </div>
    )
  }
}

const GenderBox = (props) => (
  <div className={s.genderEligibilityBox}>
    <span className={s.genderEligibilityLabel}>Gender Eligibility </span>
    {gender.map((gender, i) => (
     <ToggleButton
       key={`gender-${gender.name}`}
       enabled={props.getGenderClass(gender)}
       extraClasses={`${s.categoryIcon} ${gender.icon}`}
       onClick={(e) => props.handleGender(gender)}
       label={gender.name}
     />
    ))}
  </div>
)

const AgeBox = (props) => (
  <div className={s.ageEligibilityBox}>
    <span className={s.ageEligibilityLabel}>Age Eligibility </span>
    {age.map((age, i) => (
     <ToggleButton
       key={`age-${age.name}`}
       enabled={props.getAgeClass(age)}
       onClick={(e) => props.handleAge(age)}
       label={age.name}
     />
    ))}
  </div>
)

const ScheduleBox = (props) => (
  <div className={s.scheduleBox}>
    <TimeRangePicker
      key={`timePicker-${index}`}
      rangeLabel={props.schedule.weekday}
      startTime={props.schedule.opensAt}
      endTime={props.schedule.closesAt}
      handleUpdate={props.handleTimeChange}
      metadata={{ scheduleNum: props.index, day: index}}/>
  </div>
)

export default ServiceEdit
