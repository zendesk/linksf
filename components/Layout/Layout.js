import React, { PropTypes } from 'react'
import s from './Layout.css'
import Navigation from './Navigation'
import Footer from './Footer'

function Layout({ admin, children }) {
  return (
    <div>
      <Navigation />
      <div className={s.center}>
        <div id="index" className={admin ? s.adminContent : s.content}>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
