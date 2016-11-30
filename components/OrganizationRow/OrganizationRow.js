import React, { PropTypes } from 'react'

import icons from '../../icons/css/icons.css'
import s from './OrganizationRow.css'

import Link from '../Link'


const OrganizationRow = (props) => (
  <li className={s.organization} key={`organization-${props.organization.id}`}>
    <Link
      to={`/admin/organizations/${props.organization.id}`}
      className={s.organizationLink}
      title={`Click to edit ${props.organization.name}`}>
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
    </Link>
  </li>
)

export default OrganizationRow
