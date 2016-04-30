import React, { PropTypes } from 'react'
import './ServiceList.scss'
import ServiceRow from '../ServiceRow'

const services = [
  {
    createdAt: 'now',
    description: 'ppl like this place',
    eligibility: {
      age: [10, 55],
      gender: 'F',
    },
    email: 'coolkidz@zendesk.com',
    location_id: 0,
    name: 'UCSF Alliance Health Project',
    organization: 0,
    physical_address: 0,
    regular_schedules: [0],
    taxonomy: 'food',
    updated_at: 'now',
    url: 'http://sfcool.com',
  },
  {
    createdAt: 'now',
    description: 'ppl like this place too',
    eligibility: {
      age: [15, 90],
      gender: 'M',
    },
    email: 'coolkidz2@zendesk.com',
    location_id: 1,
    name: 'Zendesk Project Dos',
    organization: 1,
    physical_address: 1,
    regular_schedules: [1],
    taxonomy: 'food',
    updated_at: 'now',
    url: 'http://google.com',
  },
]

const ServiceList = () => (
  <div className="column">
    {services.map(ServiceRow)}
  </div>
)

ServiceList.propTypes = {
  name: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
}

export default ServiceList
