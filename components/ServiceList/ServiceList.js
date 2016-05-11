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
    locationId: 0,
    name: 'UCSF Alliance Health Project',
    organization: 0,
    physicalAddress: 0,
    regularSchedules: [
      {
        closesAt: 1500,
        locationId: 0,
        opensAt: 800,
        organizationId: 0,
        serviceId: 0,
        weekday: 'Monday',
      },
      {
        closesAt: 1500,
        locationId: 0,
        opensAt: 800,
        organizationId: 0,
        serviceId: 0,
        weekday: 'Tuesday',
      },
      {
        closesAt: 1000,
        locationId: 0,
        opensAt: 900,
        organizationId: 0,
        serviceId: 0,
        weekday: 'Wednesday',
      },
      {
        closesAt: 1600,
        locationId: 0,
        opensAt: 900,
        organizationId: 0,
        serviceId: 0,
        weekday: 'Thursday',
      },
      {
        closesAt: 1600,
        locationId: 0,
        opensAt: 900,
        organizationId: 0,
        serviceId: 0,
        weekday: 'Friday',
      },
    ],
    taxonomy: 'food',
    updatedAt: 'now',
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
    locationId: 1,
    name: 'Zendesk Project Dos',
    organization: 1,
    physicalAddress: 1,
    regularSchedules: [
      {
        closesAt: 1600,
        locationId: 1,
        opensAt: 900,
        organizationId: 1,
        serviceId: 1,
        weekday: 'Monday',
      },
      {
        closesAt: 1600,
        locationId: 1,
        opensAt: 900,
        organizationId: 1,
        serviceId: 1,
        weekday: 'Wednesday',
      },
      {
        closesAt: 1000,
        locationId: 1,
        opensAt: 900,
        organizationId: 1,
        serviceId: 1,
        weekday: 'Thursday',
      },
    ],
    taxonomy: 'food',
    updatedAt: 'now',
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
