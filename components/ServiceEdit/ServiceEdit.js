import React, { PropTypes } from 'react'
import s from './ServiceEdit.css'
import icons from '../../icons/css/icons.css'

import ServiceStatus from '../ServiceStatus'

class ServiceEdit extends React.Component{
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={s.serviceEditBox}>
        <div className={s.name}>
          <span className={s.nameLabel}>Service Name </span>
          <input
            type="text"
            value={this.props.service.name}
            onChange={this.props.handleChange}
          />
        </div>
        <div className={s.descriptionBox}>
          <span className={s.descriptionLabel}>Service Description </span>
          <input
            type="text"
            value={this.props.service.description}
            onChange={this.props.handleChange}
          />
        </div>
        <div className={s.applicationBox}>
          <span className={s.applicationLabel}>Application Process </span>
          <input
            type="text"
            value={this.props.service.applicationProcess}
            onChange={this.props.handleChange}
          />
        </div>
        <div className={s.elegibilityBox}>
          <span className={s.eligibilityLabel}>Elegibility Information </span>
          <GenderBox gender={this.props.service.eligibility.gender} changeState={this.props.handleChange} />
          <AgeBox gender={this.props.service.eligibility.age} changeState={this.props.handleChange} />
        </div>
        <div className={s.schedulesBox}>
          <span className={s.schedulesLabel}>Schedule </span>
					{this.props.service.schedules.map((obj, index) => <ScheduleBox key={`schedule-${index}`} schedule={obj} changeState={this.props.handleChange} /> )}
        </div>
        <div className={s.taxonomyBox}>
          <span className={s.taxonomyLabel}>Categories </span>
          <input
            type="text"
            value={this.props.service.taxonomy}
            onChange={this.props.handleChange}
          />
        </div>
      </div>
    )
  }
}

const GenderBox = (props) => (
   <div className={s.genderEligibilityBox}>
     <span className={s.genderEligibilityLabel}>Gender Eligibility </span>
     <input
       type="text"
       value={props.gender}
       onChange={props.changeState}
     />
   </div>
 )

const AgeBox = (props) => (
   <div className={s.ageEligibilityBox}>
     <span className={s.ageEligibilityLabel}>Age Eligibility </span>
     <input
       type="text"
       value={props.age}
       onChange={props.changeState}
     />
   </div>
 )

const ScheduleBox = (props) => (
	<div className={s.scheduleBox}>
		<span className={s.scheduleLabel}>Schedule </span>
		{props.schedule.map((obj, index) => <DayScheduleBox day={obj} key={`day-${index}`} changeState={props.handleChange} /> )}
	</div>
)

const DayScheduleBox = (props) => (
   <div className={s.scheduleBox}>
     <span className={s.scheduleLabel}>{props.day.weekday} </span>
     <span className={s.scheduleBeginLabel}>Opens at </span>
     <input
       type="text"
       value={props.day.opens_at}
       onChange={props.day.changeState}
     />
     <span className={s.scheduleEndLabel}>Closes at</span>
     <input
       type="text"
       value={props.day.closes_at}
       onChange={props.day.changeState}
     />
   </div>
 )

export default ServiceEdit
