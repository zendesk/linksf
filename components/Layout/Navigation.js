import React from 'react'
import Link from '../Link'
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

class Navigation extends React.Component {
  render() {
    return (
      <nav className={s.header} role="navigation">
        <div>
          <div className="nav-container">
            <Link className={s.logo} to="/">
              <img
                onClick={Link.handleClick}
                className={s.logoImg}
                role="link"
                src="/link-sf.png"
                alt="San Francisco website that connects homeless and low-income residents with critical and life-saving resources"
              />
            </Link>
            <CurrentUser { ...this.props } />
          </div>
        </div>
      </nav>
    )
  }

}

export default Navigation
