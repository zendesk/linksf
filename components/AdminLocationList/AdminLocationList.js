import React, { PropTypes } from 'react'
import s from './AdminLocationList.css'
import AdminLocationRow from '../AdminLocationRow'

const AdminLocationList = (props) => (
  <div className={s.column}>
    {props.locations.map((loc) => <AdminLocationRow location={loc} editLink={props.editLink} /> )}
  </div>
)

AdminLocationList.propTypes = {
  name: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
}

export default AdminLocationList
