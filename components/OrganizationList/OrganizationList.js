import React, { PropTypes } from 'react'
import s from './OrganizationList.css'
import OrganizationRow from '../OrganizationRow/'

const OrganizationList = (props) => {
  return (
    <div className={s.column}>
      {props.organizations.map((org, index) => (
        <OrganizationRow
          key={`organization-${index}`}
          organization={org}
          index={index}
          editLink={props.editLink} />
      ))}
    </div>
  )
}

export default OrganizationList
