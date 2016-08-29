import React, { PropTypes } from 'react'
import s from './OrganizationRow.css'
import icons from '../../icons/css/icons.css'

const OrganizationRow = (props) => {
  console.log(props.organization)
  return (
    <li className={s.organization} key={`organization-${props.organization.id}`}>
      <a onClick={() => props.editLink(props.organization)} className={s.organizationLink} title={`Click to edit ${props.organization.name}`}>
        <div>
          <div>
            <p className={s.organizationName}>{props.organization.name}</p>
          </div>
          <div className={s.organizationBox}>
            <div className={s.organizationInfo}>
              {props.organization.long_description}
            </div>
            <div className="organization-item-box-caret">
              <i className={`${icons.iconRightOpen2} s.rightCaret`}></i>
            </div>
          </div>
        </div>
      </a>
    </li>
  )
}

export default OrganizationRow
