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
import TextInput from '../../components/TextInput'
import TextArea from '../../components/TextArea'
import Button from '../../components/Button'

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
    if (!this.state.name || !this.state.email || !this.state.subject || !this.state.message) {
      console.log(this.state)
    }
  }

  render() {
    return (
      <Layout>
        <h4>Give us feedback</h4>
        <form onSubmit={this.handleSubmit}>
          <label>Name</label>
          <TextInput
            placeholder="Your name"
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
          />
          <label>Email</label>
          <TextInput
            placeholder="Your email"
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
          />
          <label>Subject</label>
          <TextInput
            placeholder="Subject"
            value={this.state.subject}
            onChange={e => this.setState({ subject: e.target.value })}
          />
          <label>Message</label>
          <TextArea
            placeholder="Message"
            value={this.state.message}
            onChange={e => this.setState({ message: e.target.value })}
          />
          <Button type="submit" value="Post">Submit Feedback</Button>
        </form>
      </Layout>
    )
  }

}

export default FeedbackPage
