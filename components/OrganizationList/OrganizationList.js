import React, { PropTypes } from 'react'
import s from './OrganizationList.css'
import OrganizationRow from '../OrganizationRow/'

const OrganizationList = (props) => (
  <div className={s.column}>
    {props.organizations.map((org) => <OrganizationRow organization={org} editLink={props.editLink} /> )}
  </div>
)

OrganizationList.propTypes = {
  name: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
}

export default OrganizationList
