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
      sortBy: 'name',
      hours: 'all',
      services: [],
      demographics: [],
      gender: '',
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
    const { taxonomies, sortBy, hours, services, demographics, gender } = this.state

    return (
      <Layout>
        <div className={s.page}>
          <Group>
            <Title>
              Sort by
            </Title>
            <ButtonGroup>
              <LeftButton active={sortBy === 'distance'} disabled="true">Distance</LeftButton>
              <RightButton active={sortBy === 'name'}>Name</RightButton>
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
              <LeftButton active={hours === 'all'}>All</LeftButton>
              <RightButton active={hours === 'open'}>Open Now</RightButton>
            </ButtonGroup>
          </Group>
          <Group>
            <Title>
              Service
            </Title>
            <ServiceGroup>
              {taxonomies.map(category => (
                <ServiceFilter active={services.includes(category.name)} category={category} />
              ))}
            </ServiceGroup>
          </Group>
          <Group>
            <Title>
              Suitable for
            </Title>
            <ButtonGroup>
              <LeftButton active={demographics.includes('C')}>Children</LeftButton>
              <MiddleButton active={demographics.includes('Y')}>Youth</MiddleButton>
              <MiddleButton active={demographics.includes('A')}>Adults</MiddleButton>
              <RightButton active={demographics.includes('S')}>Seniors</RightButton>
            </ButtonGroup>
          </Group>
          <Group>
            <Title>
              Welcome
            </Title>
            <ButtonGroup>
              <LeftButton active={gender === ''}>All</LeftButton>
              <MiddleButton active={gender === 'M'}>Men</MiddleButton>
              <RightButton active={gender === 'F'}>Women</RightButton>
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

const filterOut = (props, thingsToExclude) => {
  return Object.keys(props)
    .filter(prop => !thingsToExclude.includes(prop))
    .reduce((o, k) => {
      o[k] = props[k]
      return o
    }, {})
}

const ServiceFilter = (props) => (
  <button className={s.service} {...filterOut(props, ['active', 'category'])}>
    <i className={`${s.categoryIcon} ${props.category.icon}`}></i>
    {props.category.name}
  </button>
)

const LeftButton = (props) => (
  <button className={[s.button, s.leftButton, props.active ? s.active : ''].join(' ')} {...filterOut(props, ['active'])}>
    {props.children}
  </button>
)

const MiddleButton = (props) => (
  <button className={[s.button, s.middleButton, props.active ? s.active : ''].join(' ')} {...filterOut(props, ['active'])}>
    {props.children}
  </button>
)

const RightButton = (props) => (
  <button className={[s.button, s.rightButton, props.active ? s.active : '' ].join(' ')} {...filterOut(props, ['active'])}>
    {props.children}
  </button>
)

export default OptionsPage
