import React, { Component } from 'react'
import R from 'ramda'

import s from './PhoneEdit.css'

class PhoneEdit extends Component {
  updatePhone = (property, value) => {
    const { index, handleChange } = this.props

    handleChange(property, value, index)
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
          onChange={(e) => this.updatePhone('number', e.target.value)}
        />
        <span className={s.label}>Department </span>
        <input
          className={s.input}
          type="text"
          value={phone.department}
          onChange={(e) => this.updatePhone('department', e.target.value)}
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
