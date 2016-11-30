import React from 'react'
import s from './Toggle.css'

const Toggle = (props) => (
  <div
    className={`${s.switch} ${props.disabled ? s.disabled : ''}`}
    tabIndex="0"
    onMouseUp={(e) => props.onMouseUp && props.onMouseUp(e)}
  >
    <div className={s.mask}>
      <div className={`${s.container} ${props.on ? s.containerOn : s.containerOff}`}>
        <div className={s.switchUpper}>
          <span className={s.handle}></span>
        </div>
        <div className={s.switchLower}>
          <div className={s.labels}>
            <span className={s.on} tabIndex="-1">{props.onLabel || 'YES'}</span>
            <span className={s.off} tabIndex="-1">{props.offLabel || 'NO'}</span>
          </div>
        </div>
      </div>
    </div>
    <div className={s.switchMiddle}></div>
  </div>
)

export default Toggle
