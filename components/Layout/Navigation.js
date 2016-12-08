import React, { Component } from 'react'

import history from '../../core/history'

import Link from '../Link'
import Button from '../Button'
import s from './Navigation.css'

const CurrentUser = (props) => {
  if (props.currentUser) {
    return (
      <div className={s.currentUser}>
        <span className={s.currentUserDetails}>Logged in as: <strong>{props.currentUser.email}</strong></span>
        <a href="/logout" className={s.logout}>Logout</a>
      </div>
    )
  } else {
    return null
  }
}

const getFilter = () => {
  const pathname = window.location.pathname
  if ((pathname === '/') || (pathname === '/options') || (pathname.startsWith('/admin'))) {
    return null
  }
  return <Link className={s.filter} to="/options">Filter</Link>
}

class Navigation extends Component {
  render() {
    return (
      <nav className={s.header} role="navigation">
        <div className={s.navTopSpace}></div>
        <div className={s.navContent}>
          <div className={s.backContainer}>
            {window.location.pathname === "/" ?
              null :
              <Link className={s.back} to="" onClick={history.goBack}>
                <svg xmlns="http://www.w3.org/2000/svg" className={s.backArrow}>
                  <path d="M1.25 11.5 L11.25 1.25 M1.25 10 L11.25 20.75 Z"/>
                </svg>
                <span className={s.backText}>Back</span>
              </Link>}
          </div>
          <div className={s.logoContainer}>
            <Link to="/">
              <img
                onClick={Link.handleClick}
                className={s.logoImg}
                role="link"
                src="/link-sf.png"
                alt="San Francisco website that connects homeless and low-income residents with critical and life-saving resources"
              />
            </Link>
          </div>
          <div className={s.filterContainer}>
            {getFilter()}
          </div>
          <CurrentUser {...this.props} />
        </div>
      </nav>
    )
  }

}

export default Navigation
