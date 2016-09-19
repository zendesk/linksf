import React, { PropTypes } from 'react'
import s from './OrganizationList.css'
import OrganizationRow from '../OrganizationRow/'

const OrganizationList = (props) => {
  return (
    <div className={s.column}>
      {props.organizations.map((org, index) => <OrganizationRow organization={org} index={index} editLink={props.editLink} /> )}
    </div>
  )
}

OrganizationList.propTypes = {
  name: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
}

export default OrganizationList
