import 'babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import Location from './core/Location'
import Layout from './components/Layout'

const routes = {} // Auto-generated on build. See tools/lib/routes-loader.js

const route = async (path, callback) => {
  const serviceDetailRegex = /\/services\/detail\/(\d+)/
  const foundServiceDetail = path.match(serviceDetailRegex)
  const serviceId = foundServiceDetail ? serviceDetailRegex.exec(path)[1] : null
  const handler =
    foundServiceDetail ?
    routes['/service'] :
    routes[path] || routes['/404']
  const props = { serviceId }
  const component = await handler()
  await callback(<Layout>{React.createElement(component, props)}</Layout>)
}

function run() {
  const container = document.getElementById('app')
  Location.listen(location => {
    route(location.pathname, async (component) => ReactDOM.render(component, container, () => {
      // Track the page view event via Google Analytics
      window.ga('send', 'pageview')
    }))
  })
}

if (canUseDOM) {
  // Run the application when both DOM is ready and page content is loaded
  if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
    run()
  } else {
    document.addEventListener('DOMContentLoaded', run, false)
  }
}

export default { route, routes }
