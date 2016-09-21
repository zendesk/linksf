import React, { Component } from 'react'

import s from '../OrganizationEdit/OrganizationEdit.css' // FIXME

const PhoneEdit = (props) => {
  function updatePhone(value, event) {
    const { phone } = props
    const newPhone = phone
    newPhone[value] = event.target.value
    props.handleChange(newPhone, props.index)
  }

  function deletePhone() {
    props.handleDelete(props.index)
  }

  return (
    <div className={s.phoneEditBox}>
      <span className={s.phoneDepartmentLabel}>Department </span>
      <input
        className={s.input}
        type="text"
        value={props.phone.department}
        onChange={(e) => updatePhone('department', e)}
      />
      <span className={s.phoneNumberLabel}>Number </span>
      <input
        className={s.input}
        type="tel"
        value={props.phone.number}
        onChange={(e) => updatePhone('number', e)}
      />
      <button onClick={deletePhone}>Delete</button>
    </div>
  )
}

export default PhoneEdit
