import React, { Component } from 'react'
import './Toggle.css'

export default class extends Component {
  render() {
    return (
      <input type="checkbox" value={this.props.value || 'X'}/>
    )
  }
}
