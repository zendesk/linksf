import React, { Component } from 'react'

import icons from '../../icons/css/icons.css'
import { fetchTaxonomies } from '../../core/firebaseRestAPI'
import { taxonomiesWithIcons } from '../../lib/taxonomies'

import s from './options.css'
import Layout from '../../components/Layout'


class OptionsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      taxonomies: [],
    }
  }

  componentDidMount() {
    document.title = 'Link-SF'
    fetchTaxonomies()
      .then(taxonomies => {
        this.setState({
          taxonomies: taxonomiesWithIcons(taxonomies)
        })
      })
  }

  render() {
    const { taxonomies } = this.state

    return (
      <Layout>
        <div className={s.page}>
          <Group>
            <Title>
              Sort by
            </Title>
            <ButtonGroup>
              <LeftButton disabled="true">Distance</LeftButton>
              <RightButton active>Name</RightButton>
            </ButtonGroup>
          </Group>
          <div className={s.alert}>
            <strong>Distance disabled:</strong> current location unavailable
          </div>
          <Group>
            <Title>
              Hours
            </Title>
            <ButtonGroup>
              <LeftButton>All</LeftButton>
              <RightButton>Open Now</RightButton>
            </ButtonGroup>
          </Group>
          <Group>
            <Title>
              Service
            </Title>
            <ServiceGroup>
              {taxonomies.map(category => <ServiceFilter category={category} />)}
            </ServiceGroup>
          </Group>
          <Group>
            <Title>
              Suitable for
            </Title>
            <ButtonGroup>
              <LeftButton>Children</LeftButton>
              <MiddleButton>Youth</MiddleButton>
              <MiddleButton>Adults</MiddleButton>
              <RightButton>Seniors</RightButton>
            </ButtonGroup>
          </Group>
          <Group>
            <Title>
              Welcome
            </Title>
            <ButtonGroup>
              <LeftButton>All</LeftButton>
              <MiddleButton>Men</MiddleButton>
              <RightButton>Women</RightButton>
            </ButtonGroup>
          </Group>
          <div>
            <button className={s.searchButton}>Search</button>
          </div>
        </div>
      </Layout>
    )
  }
}

const Group = (props) => (
  <div {...props} className={s.group}>
    {props.children}
  </div>
)

const Title = (props) => (
  <h1 className={s.title} {...props}></h1>
)

const ButtonGroup = (props) => (
  <div className={s.title} {...props}>
    {props.children}
  </div>
)

const ServiceGroup = (props) => (
  <div className={s.serviceGroup} {...props}>
    {props.children}
  </div>
)

const ServiceFilter = (props) => (
  <button className={s.service}>
    <i className={`${s.categoryIcon} ${props.category.icon}`}></i>
    {props.category.name}
  </button>
)

const removeActive = (props) => {
  const newProps = Object.assign({}, props)
  delete newProps.active
  return newProps
}

const LeftButton = (props) => (
  <button className={[s.button, s.leftButton, props.active ? s.active : ''].join(' ')} {...removeActive(props)}>
    {props.children}
  </button>
)

const MiddleButton = (props) => (
  <button className={[s.button, s.middleButton, props.active ? s.active : ''].join(' ')} {...removeActive(props)}>
    {props.children}
  </button>
)

const RightButton = (props) => (
  <button className={[s.button, s.rightButton, props.active ? s.active : '' ].join(' ')} {...removeActive(props)}>
    {props.children}
  </button>
)

export default OptionsPage
