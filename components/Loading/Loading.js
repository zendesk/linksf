import React, { Component } from 'react'
import s from './Loading.css'

const Loading = (props) => (
  <div className={s.loading}>
    <img src="/linksf_loader.gif" className={s.loadingGif} />
  </div>
)

export default Loading
