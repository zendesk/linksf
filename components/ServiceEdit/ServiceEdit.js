import React, { Component } from 'react'
import s from './ServiceEdit.css'
import icons from '../../icons/css/icons.css'
import { gender } from '../../lib/eligibilities'
import { age } from '../../lib/eligibilities'
import TimeRangePicker from '../TimeRangePicker'

class ServiceEdit extends Component {
  updateService = (field, value) => {
    const { service, index, handleChange } = this.props
    const newService = service

    newService[field] = value
    handleChange(newService, index)
  }

  deleteService = () => {
    const { index, handleDelete } = this.props

    handleDelete(index)
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

    if (stateVal.includes(value.key))
      classes.push(s.selectableButtonActive)

    return classes.join(' ')
  }

  getGenderClass = (value) => {
    let classes = [s.selectableButton]
    const { eligibility } = this.props.service
    let stateVal = eligibility ? eligibility.gender : ''

    if (stateVal == value.key)
      classes.push(s.selectableButtonActive)

    return classes.join(' ')
  }

  getCategoryClass = (value) => {
    let classes = [s.selectableButton]
    const { taxonomy } = this.props.service

    if (taxonomy.toLowerCase() == value.taxonomy)
      classes.push(s.selectableButtonActive)

    return classes.join(' ')
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
    const { service } = this.props

    return (
      <div className={s.serviceEditBox}>
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
          {categories.map((category, i) => (
            <button
              key={`category-${i}`}
              className={this.getCategoryClass(category)}
              onClick={(e) => this.updateService('taxonomy', category.taxonomy.toLowerCase())}
            >
            <i className={`${s.categoryIcon} ${category.icon}`}></i>
            {category.name}
            </button>
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
     <button
       key={`gender-${gender.name}`}
       className={props.getGenderClass(gender)}
       onClick={(e) => props.handleGender(gender)}
     >
     <i className={`${s.categoryIcon} ${gender.icon}`}></i>
     {gender.name}
     </button>
    ))}
  </div>
)

const AgeBox = (props) => (
  <div className={s.ageEligibilityBox}>
    <span className={s.ageEligibilityLabel}>Age Eligibility </span>
    {age.map((age, i) => (
     <button
       key={`age-${age.name}`}
       className={props.getAgeClass(age)}
       onClick={(e) => props.handleAge(age)}
     >
     {age.name}
     </button>
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
