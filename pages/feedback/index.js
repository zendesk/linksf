/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react'
import Layout from '../../components/Layout'

class FeedbackPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      subject: '',
      message: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    console.log(this.state)
  }

  render() {
    return (
      <Layout>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Your email"
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Subject"
            value={this.state.subject}
            onChange={e => this.setState({ subject: e.target.value })}
          />
          <textarea
            type="text"
            placeholder="Message"
            value={this.state.message}
            onChange={e => this.setState({ message: e.target.value })}
          />
          <input type="submit" value="Post" />
        </form>
      </Layout>
    )
  }

}

export default FeedbackPage
