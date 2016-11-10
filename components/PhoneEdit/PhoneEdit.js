import React, { Component } from 'react'

import s from './PhoneEdit.css'

class PhoneEdit extends Component {
   updatePhone = (value, event) => {
    const { phone, index, handleChange } = this.props
    const newPhone = phone

    newPhone[value] = event.target.value
    handleChange(newPhone, index)
  }

   deletePhone = () => {
    const { index, handleDelete } = this.props

    handleDelete(index)
  }

  render() {
    const { phone } = this.props

    return (
      <div className={s.phoneEditBox}>
        <span className={s.label}>Number </span>
        <input
          className={s.input}
          type="tel"
          value={phone.number}
          onChange={(e) => this.updatePhone('number', e)}
        />
        <span className={s.label}>Department </span>
        <input
          className={s.input}
          type="text"
          value={phone.department}
          onChange={(e) => this.updatePhone('department', e)}
        />
        <div className={s.inputGroup}>
          <button
            className={s.buttonStyle}
            onClick={this.deletePhone}>Delete this Phone</button>
        </div>
      </div>
    )
  }
}

export default PhoneEdit
