import React, { PropTypes } from 'react'
import s from './Layout.css'
import Navigation from './Navigation'

function Layout({ children }) {
  return (
    <div className={s.layout}>
      <Navigation />
      <div id="index">
        {children}
      </div>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
}

export default Layout
