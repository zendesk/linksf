import React, { PropTypes } from 'react'
import s from './ServiceEdit.css'
import icons from '../../icons/css/icons.css'
import { gender } from '../../lib/eligibilities'
import { age } from '../../lib/eligibilities'
import { categories } from '../../lib/categories'
import TimeRangePicker from '../TimeRangePicker'

const ServiceEdit = (props) => {
  function updateService(field, value) {
    const { service } = props
    const newService = service
    newService[field] = value
    props.handleChange(newService, props.index)
  }

  function handleServiceChange(field, event) {
    updateService(field, event.target.value)
  }

  function handleGender(value) {
    const { eligibility } = props.service
    const newEligibility = eligibility
    newEligibility['gender'] = value.key
    updateService('eligibility', newEligibility)
  }

  function handleAge(value) {
    const { eligibility } = props.service
    const newEligibility = eligibility
    let newAge = newEligibility.age || ''
    if (newAge.includes(value.key)) {
      newAge = newAge.replace(value.key, '')
    } else {
      newAge = newAge + value.key
    }
    newEligibility['age'] = newAge
    updateService('eligibility', newEligibility)
  }

  function getAgeClass(value) {
    let classes = [s.selectableButton]
    const { eligibility } = props.service
    let stateVal = eligibility['age'] || ''
    if (stateVal.includes(value.key))
      classes.push(s.selectableButtonActive)

    return classes.join(' ')
  }

  function getGenderClass(value) {
    let classes = [s.selectableButton]
    const { eligibility } = props.service
    let stateVal = eligibility['gender'] || ''
    if (stateVal == value.key)
      classes.push(s.selectableButtonActive)

    return classes.join(' ')
  }

  function getCategoryClass(value) {
    let classes = [s.selectableButton]
    const { taxonomy } = props.service
    if (taxonomy.toLowerCase() == value.taxonomy)
      classes.push(s.selectableButtonActive)

    return classes.join(' ')
  }

  function handleTimeChange(event, start_or_end, metadata) {
    const { schedules } = props.service
    const newSchedules = schedules
    if (start_or_end == 'start') {
      newSchedules[metadata.scheduleNum][metadata.day]['opens_at'] = event.target.value.replace(':', '')
    } else {
      newSchedules[metadata.scheduleNum][metadata.day]['closes_at'] = event.target.value.replace(':', '')
    }

    updateService('schedules', newSchedules)
  }

  return (
    <div className={s.serviceEditBox}>
      <div className={s.name}>
        <span className={s.nameLabel}>Service Name </span>
        <input
          type="text"
          value={props.service.name}
          onChange={(e) => handleServiceChange('name', e)}
        />
      </div>
      <div className={s.descriptionBox}>
        <span className={s.descriptionLabel}>Service Description </span>
        <input
          type="text"
          value={props.service.description}
          onChange={(e) => handleServiceChange('description', e)}
        />
      </div>
      <div className={s.applicationBox}>
        <span className={s.applicationLabel}>Application Process </span>
        <input
          type="text"
          value={props.service.application_process}
          onChange={(e) => handleServiceChange('application_process', e)}
        />
      </div>
      <div className={s.elegibilityBox}>
        <span className={s.eligibilityLabel}>Elegibility Information </span>
        <GenderBox gender={props.service.eligibility.gender} getGenderClass={getGenderClass} handleGender={handleGender}/>
        <AgeBox gender={props.service.eligibility.age} getAgeClass={getAgeClass} handleAge={handleAge} />
      </div>
      <div className={s.schedulesBox}>
        <span className={s.schedulesLabel}>Schedule </span>
        {props.service.schedules.map((obj, index) => <ScheduleBox key={`schedule-${index}`} index={index} schedule={obj} handleTimeChange={handleTimeChange} /> )}
      </div>
      <div className={s.taxonomyBox}>
        <span className={s.taxonomyLabel}>Category </span>
        {categories.map((category, i) => (
          <button
            key={`category-${i}`}
            className={getCategoryClass(category)}
            onClick={(e) => updateService('taxonomy', category.taxonomy.toLowerCase())}
          >
          <i className={`${s.categoryIcon} ${category.icon}`}></i>
          {category.name}
          </button>
        ))}
      </div>
    </div>
  )
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
    <span className={s.scheduleLabel}>Schedule </span>
    {props.schedule.map((obj, index) => <TimeRangePicker rangeLabel={obj.weekday} startTime={obj.opens_at} endTime={obj.closes_at} handleUpdate={props.handleTimeChange} metadata={{ scheduleNum: props.index, day: index}}/> )}
  </div>
)

export default ServiceEdit
