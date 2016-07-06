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
import Home from '../../components/Home'
import Layout from '../../components/Layout'

class HomePage extends React.Component {

  componentDidMount() {
    document.title = 'Home'
  }

  render() {
    return (
      <Layout>
        <Home />
      </Layout>
    )
  }

}

export default HomePage
