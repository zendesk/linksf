import React, { Component, PropTypes } from 'react'

import history from '../../core/history'
import { redirectTo } from '../../lib/navigation'

const EMPTY_QUERY = {
  sortBy: '',
  hours: 'all',
  services: [],
  demographics: [],
  gender: ''
}

const convertToQueryString = (partsOfQuery) => {
  console.log(partsOfQuery)
  const query = Object.assign(EMPTY_QUERY, partsOfQuery)
  console.log(query)
  const { sortBy, hours, services, demographics, gender } = query
  const sortByString = sortBy === 'distance' ? '&sortBy=distance' : ''
  const hoursString = hours === 'open' ? '&hours=open' : ''
  const servicesString = services.length > 0 ?
    `&categories[]=${services.join(',')}` :
    ''
  const demographicsString = demographics.length > 0 ?
    `&demographics[]=${demographics.join(',')}` :
    ''

  const genderString = gender ? `&gender=${gender}` : ''
  const queryString = [sortByString, hoursString, servicesString, demographicsString, genderString].join('')

  return `?${queryString.slice(1, queryString.length)}`
}

class Link extends Component {

  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    onClick: PropTypes.func,
  }

  handleClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event)
    }

    if (event.button !== 0 /* left click */) {
      return
    }

    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return
    }

    if (event.defaultPrevented === true) {
      return
    }

    event.preventDefault()

    const queryString = convertToQueryString(this.props.query)

    if (this.props.to && this.props.query) {
      redirectTo({
        pathname: this.props.to,
        search: queryString
      })
    } else if (this.props.to) {
      redirectTo(this.props.to)
    } else {
      redirectTo({
        pathname: event.currentTarget.pathname,
        search: event.currentTarget.search,
      })
    }
  }

  render() {
    const { to, query, ...props } = this.props; // eslint-disable-line no-use-before-define
    return <a href={history.createHref(to)} {...props} onClick={this.handleClick} />
  }

}

export default Link
