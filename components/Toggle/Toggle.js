import React, { Component } from 'react'
import './Toggle.scss'

export default class extends Component {
  render() {
    return (
      <input type="checkbox" value={this.props.value || 'X'}/>
    )
  }
}
