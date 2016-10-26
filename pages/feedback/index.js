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

class FeedbackPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
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
    e.preventDefault()
    if (!this.state.name || !this.state.email || !this.state.subject || !this.state.message) {
      this.setState({ error: 'Please fill out all fields' })
    } else {
      this.setState({ name: '', email: '', subject: '', message: '', error: '' })
    }
  }

  render() {
    return (
      <Layout>
        {this.state.error ? <Error message={this.state.error} /> : ''}
        <h4>Give us feedback</h4>
        <form onSubmit={this.handleSubmit}>
          <label>Name</label>
          <TextInput
            placeholder="Your name"
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
            required
          />
          <label>Email</label>
          <TextInput
            placeholder="Your email"
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
            required
          />
          <label>Subject</label>
          <TextInput
            placeholder="Subject"
            value={this.state.subject}
            onChange={e => this.setState({ subject: e.target.value })}
            required
          />
          <label>Message</label>
          <TextArea
            placeholder="Message"
            value={this.state.message}
            onChange={e => this.setState({ message: e.target.value })}
            required
          />
          <Button type="submit" value="Post">Submit Feedback</Button>
        </form>
      </Layout>
    )
  }

}

export default FeedbackPage
