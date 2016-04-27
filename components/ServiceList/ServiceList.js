import React, { PropTypes } from 'react'

const services = () => (
  <div>hey</div>
)

services.propTypes = {
  name: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
}

export default services
