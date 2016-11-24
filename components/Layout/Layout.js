import React, { PropTypes } from 'react'

import { currentUser } from '../../lib/session'

import s from './Layout.css'
import Navigation from './Navigation'
import Footer from './Footer'

function Layout({ admin, children }) {
  return (
    <div className={s.body}>
      <Navigation currentUser={admin && currentUser()} />
      <div className={s.center}>
        <div className={admin ? s.adminContent : s.content}>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
