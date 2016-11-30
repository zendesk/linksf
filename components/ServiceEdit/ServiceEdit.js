import React, { Component } from 'react'
import s from './ServiceEdit.css'
import icons from '../../icons/css/icons.css'
import { gender } from '../../lib/eligibilities'
import { age } from '../../lib/eligibilities'
import { uuid } from '../../lib/uuid'
import TimeRangePicker from '../TimeRangePicker'
import ToggleButton from '../ToggleButton'

/* The existing times range 0-2359. This was the easiest way I could think of to make sure that the previous day always weighted less than the next day. */
const scheduleSorter = {
  "-":        -1,
  "Sunday":    0,
  "Monday":    10000,
  "Tuesday":   20000,
  "Wednesday": 30000,
  "Thursday":  40000,
  "Friday":    50000,
  "Saturday":  60000
}

class ServiceEdit extends Component {

  blankSchedule = () => {
    const { service } = this.props
    return {
      opensAt: "0000",
      closesAt: "0000",
      id: uuid(),
      locationId: service.locationId,
      organizationId: service.organization,
      serviceId: service.id,
      weekday: "-"
    }
  }

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

  handleTimeChange = (event, value_changed, metadata) => {
    const { schedules } = this.props.service
    const newSchedules = schedules

    if (value_changed == 'start') {
      newSchedules[metadata.scheduleNum]['opensAt'] = event.target.value.replace(':', '')
    } else if (value_changed == 'end') {
      newSchedules[metadata.scheduleNum]['closesAt'] = event.target.value.replace(':', '')
    } else {
      if (event.target.value == '-'){
        window.alert("You must choose a weekday for a schedule")
        return
      }
      newSchedules[metadata.scheduleNum]['weekday'] = event.target.value
    }

    this.updateService('schedules', newSchedules)
  }

  handleTimeDelete = (index) => {
    const { schedules } = this.props.service
    const newSchedules = schedules

    newSchedules.splice(index, 1)

    this.updateService('schedules', newSchedules)
  }

  sortSchedules = (schedules) => {
    return schedules.sort(function(a, b) {
      return (scheduleSorter[a.weekday] + parseInt(a.opensAt)) - (scheduleSorter[b.weekday] + parseInt(b.opensAt))
    })
  }

  newSchedule = () => {
    const { schedules } = this.props.service
    const newSchedules = schedules

    newSchedules.push(this.blankSchedule())

    this.updateService('schedules', newSchedules)
  }

  render() {
    const { service, taxonomies } = this.props

    return (
      <div className={s.serviceEditBox}>
        <div className={s.inputBox}>
          <div className={s.inputGroup}>
            <span className={s.inputLabel}>Service Name</span>
            <input
              className={s.input}
              type="text"
              value={service.name}
              onChange={(e) => this.handleServiceChange('name', e)}
            />
          </div>
          <div className={s.inputGroup}>
            <span className={s.inputLabel}>Service Description</span>
            <input
              className={s.input}
              type="text"
              value={service.description}
              onChange={(e) => this.handleServiceChange('description', e)}
            />
          </div>
        </div>
        <div className={s.inputBox}>
          <div className={s.inputGroup}>
            <span className={s.inputLabel}>Application Process</span>
            <textarea
              className={s.input}
              type="text"
              value={service.applicationProcess}
              onChange={(e) => this.handleServiceChange('applicationProcess', e)}
            />
          </div>
        </div>
        <div className={s.inputBox}>
          <div className={s.inputGroup, s.row}>
            <span className={s.inputLabel}>Category: </span>
            {(taxonomies).map((category, i) => (
              <span className={s.inputOption}>
                <ToggleButton
                  key={`category-${i}`}
                  enabled={this.getCategoryClass(category.name.toLowerCase())}
                  extraClasses={`${s.categoryIcon} ${category.icon}`}
                  onClick={(e) => this.updateService('taxonomy', category.name.toLowerCase())}
                  label={category.name}
                />
              </span>
            ))}
          </div>
        </div>
        <h4>Select all that apply:</h4>
        <div className={s.inputBox}>
          <GenderBox
            gender={service.eligibility && service.eligibility.gender}
            getGenderClass={this.getGenderClass}
            handleGender={this.handleGender}/>
        </div>
        <div className={s.inputBox}>
          <AgeBox
            getAgeClass={this.getAgeClass}
            handleAge={this.handleAge} />
        </div>
        <div className={s.subsectionLabel}>
          Schedules
          <button
            className={s.addToSubsection}
            onClick={this.newSchedule}
            title={`Click to add a new schedule`}>
            + Add
          </button>
        </div>
        <div className={s.inputBox}>
          <div className={s.inputGroup, s.row}>
            <span className={s.inputLabel}>Schedule: </span>
            {(this.sortSchedules(service.schedules)).map((schedule, index) => (
              <ScheduleBox
                key={`schedule-${index}`}
                index={index}
                schedule={schedule}
                handleTimeChange={this.handleTimeChange}
                handleTimeDelete={this.handleTimeDelete} />
            ))}
          </div>
        </div>
        <div className={s.inputBox}>
          <div className={s.inputGroup}>
            <button
              className={s.buttonStyle}
              onClick={this.deleteService}
            >
            Delete this Service
            </button>
          </div>
        </div>
      </div>
    )
  }
}

const GenderBox = (props) => (
  <div className={s.inputGroup, s.row}>
    <span className={s.inputLabel}>Gender Eligibility: </span>
    {gender.map((gender, i) => (
    <span className={s.inputOption}>
       <ToggleButton
         key={`gender-${gender.name}`}
         enabled={props.getGenderClass(gender)}
         extraClasses={`${s.categoryIcon} ${gender.icon}`}
         onClick={(e) => props.handleGender(gender)}
         label={gender.name}
       />
     </span>
    ))}
  </div>
)

const AgeBox = (props) => (
  <div className={s.inputGroup, s.row}>
    <span className={s.inputLabel}>Age Eligibility: </span>
    {age.map((age, i) => (
      <span className={s.inputOption}>
       <ToggleButton
         key={`age-${age.name}`}
         enabled={props.getAgeClass(age)}
         onClick={(e) => props.handleAge(age)}
         label={age.name}
       />
     </span>
    ))}
  </div>
)

const ScheduleBox = (props) => (
  <div className={s.inputGroup, s.row}>
    <TimeRangePicker
      key={`timePicker-${props.index}`}
      weekday={props.schedule.weekday}
      startTime={props.schedule.opensAt}
      endTime={props.schedule.closesAt}
      handleUpdate={props.handleTimeChange}
      handleDelete={props.handleTimeDelete}
      metadata={{ scheduleNum: props.index, day: props.index}}/>
  </div>
)

export default ServiceEdit
