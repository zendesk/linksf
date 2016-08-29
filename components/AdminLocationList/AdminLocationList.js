import React, { PropTypes } from 'react'
import s from './AdminLocationList.css'
import AdminLocationRow from '../AdminLocationRow'

const AdminLocationList = (props) => (
  <div className={s.column}>
    {props.locations.map((loc, i) => (
      <AdminLocationRow
        key={`location-${i}`}
        location={loc} />)
    )}
  </div>
)

export default AdminLocationList
