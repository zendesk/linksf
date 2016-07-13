import React from 'react'
import s from './Toggle.css'

const Toggle = (props) => (
  <div className={`${s.switch} ${props.disabled ? s.disabled : ''}`} tabIndex="0">
    <div className={s.mask}>
      <div className={s.container}>
        <div className={s.switchUpper}>
          <span className={s.handle}></span>
        </div>
        <div className={s.switchLower}>
          <div className={s.labels}>
            <a href="#" className={s.on} tabIndex="-1">{props.onLabel || 'YES'}</a>
            <a href="#" className={s.off} tabIndex="-1">{props.offLabel || 'NO'}</a>
          </div>
        </div>
      </div>
    </div>
    <div className={s.switchMiddle}></div>
  </div>
)

export default Toggle
