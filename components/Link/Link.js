import React, { Component, PropTypes } from 'react'

import history from '../../core/history'
import { redirectTo, convertToQueryString } from '../../lib/navigation'


class Link extends Component {

  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    onClick: PropTypes.func,
  }

  handleClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event)
    }

    // Return early if this is *not* a left-click.
    if (event.button !== 0) {
      return
    }

    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return
    }

    if (event.defaultPrevented === true) {
      return
    }

    event.preventDefault()

    const queryString = this.props.queryString || convertToQueryString(this.props.query)

    if (this.props.to && (this.props.query || this.props.queryString)) {
      redirectTo({
        pathname: this.props.to,
        search: queryString
      })
    } else if (this.props.to) {
      redirectTo(this.props.to)
    }
  }

  render() {
    const { to, query, queryString, ...props } = this.props; // eslint-disable-line no-use-before-define
    return <a href={history.createHref(to)} {...props} onClick={this.handleClick} />
  }

}

export default Link
