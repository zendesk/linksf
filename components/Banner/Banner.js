import React, { Component, PropTypes } from 'react'
import s from './Banner.css'

const goodTitle = 'Success!'
const badTitle = 'Something went wrong!'

const formatBanner = (props) => {
  if (!props.show) {
    return `${s.banner} ${s.bannerHide}`
  } else if (props.isGood) {
    return `${s.banner} ${s.bannerGood}`
  } else {
    return `${s.banner} ${s.bannerBad}`
  }
}

const bannerTitle = (props) => {
  if (props.isGood) {
    return goodTitle
  } else {
    return badTitle
  }
}

class Banner extends Component {
  render() {
    return (
      <div className={formatBanner(this.props)}>
        <span className={s.bannerText}>{bannerTitle(this.props)}</span>
      </div>
    )
  }
}

export default Banner
