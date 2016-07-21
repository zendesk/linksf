import React, { PropTypes } from 'react'
import s from './Layout.css'
import Navigation from './Navigation'

function Layout({ children }) {
  return (
    <div>
      <Navigation />
      <div className={s.center}>
        <div id="index" className={s.content}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
