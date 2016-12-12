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
import Error from '../../components/Error'

import globalConfig from '../../config'

class FeedbackPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      submitUrl: "https://formspree.io/" + globalConfig.feedbackEmailAddress,
      name: '',
      email: '',
      subject: '',
      message: '',
      error: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    document.title = 'Feedback'
  }

  handleSubmit(e) {
    if (!this.state.name || !this.state.email || !this.state.subject || !this.state.message) {
      e.preventDefault()
      this.setState({ error: 'Please fill out all fields' })
    }
  }

  render() {
    return (
      <Layout>
        {this.state.error ? <Error message={this.state.error} /> : ''}
        <h4>Give us feedback</h4>
        <form action={this.state.submitUrl} method="POST" onSubmit={this.handleSubmit}>
          <label>Name</label>
          <TextInput
            name="name"
            placeholder="Your name"
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
            required
          />
          <label>Email</label>
          <TextInput
            name="email-address"
            placeholder="Your email"
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
            required
          />
          <label>Subject</label>
          <TextInput
            name="subject"
            placeholder="Subject"
            value={this.state.subject}
            onChange={e => this.setState({ subject: e.target.value })}
            required
          />
          <label>Message</label>
          <TextArea
            name="message"
            placeholder="Message"
            value={this.state.message}
            onChange={e => this.setState({ message: e.target.value })}
            required
          />
          <input type="hidden" name="_next" value="/" />
          <Button type="submit" value="Post">Submit Feedback</Button>
        </form>
      </Layout>
    )
  }

}

export default FeedbackPage
