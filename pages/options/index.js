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
      services: {
        food: false,
        housing: false,
        hygiene: false,
        medical: false,
        technology: false,
      },
      demographics: {
        C: false,
        Y: false,
        A: false,
        S: false,
      },
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

  setSortBy(sortBy) {
    this.setState({ sortBy })
  }

  setHours(hours) {
    this.setState({ hours })
  }

  setGender(gender) {
    this.setState({ gender })
  }

  search() {
    const { sortBy, hours, services, demographics, gender } = this.state
    const sortByString = sortBy === 'distance' ? '&sortBy=distance' : ''
    const hoursString = hours === 'open' ? '&hours=open' : ''
    const selectedServices = Object.keys(services)
      .filter(k => services[k])
    const servicesString = selectedServices.length > 0 ?
      `&categories[]=${selectedServices.join(',')}` :
      ''
    const selectedDemographics = Object.keys(demographics)
      .filter(k => demographics[k])
    const demographicsString = selectedDemographics.length > 0 ?
      `&demographics[]=${selectedDemographics.join(',')}` :
      ''

    const genderString = gender ? `&gender=${gender}` : ''

    const queryString =
      [sortByString, hoursString, servicesString, demographicsString, genderString].join('')
  }

  toggleService(service) {
    const { services } = this.state
    const newServices = Object.assign({}, services)
    newServices[service] = !services[service]
    this.setState({ services: newServices })
  }

  toggleDemographic(demographic) {
    const { demographics } = this.state
    const newDemographics = Object.assign({}, demographics)
    newDemographics[demographic] = !demographics[demographic]
    this.setState({ demographics: newDemographics })
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
              <LeftButton
                onClick={() => this.setSortBy('distance')}
                active={sortBy === 'distance'}
                disabled="true"
              >Distance
              </LeftButton>
              <RightButton
                onClick={() => this.setSortBy('name')}
                active={sortBy === 'name'}
              >Name
              </RightButton>
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
              <LeftButton
                onClick={() => this.setHours('all')}
                active={hours === 'all'}
              >All
              </LeftButton>
              <RightButton
                onClick={() => this.setHours('open')}
                active={hours === 'open'}
              >Open Now
              </RightButton>
            </ButtonGroup>
          </Group>
          <Group>
            <Title>
              Service
            </Title>
            <ServiceGroup>
              {taxonomies.map(category => (
                <ServiceFilter
                  key={`category-${category.name}`}
                  onClick={() => this.toggleService(category.id)}
                  active={services[category.id]}
                  category={category}
                />
              ))}
            </ServiceGroup>
          </Group>
          <Group>
            <Title>
              Suitable for
            </Title>
            <ButtonGroup>
              <LeftButton
                onClick={() => this.toggleDemographic('C')}
                active={demographics.C}
              >Children
              </LeftButton>
              <MiddleButton
                onClick={() => this.toggleDemographic('Y')}
                active={demographics.Y}
              >Youth
              </MiddleButton>
              <MiddleButton
                onClick={() => this.toggleDemographic('A')}
                active={demographics.A}
              >Adults
              </MiddleButton>
              <RightButton
                onClick={() => this.toggleDemographic('S')}
                active={demographics.S}
              >Seniors
              </RightButton>
            </ButtonGroup>
          </Group>
          <Group>
            <Title>
              Welcome
            </Title>
            <ButtonGroup>
              <LeftButton
                onClick={() => this.setGender('')}
                active={gender === ''}
              >All
              </LeftButton>
              <MiddleButton
                onClick={() => this.setGender('M')}
                active={gender === 'M'}
              >Men
              </MiddleButton>
              <RightButton
                onClick={() => this.setGender('F')}
                active={gender === 'F'}
              >Women
              </RightButton>
            </ButtonGroup>
          </Group>
          <div>
            <button
              onClick={() => this.search()}
              className={s.searchButton}
            >Search
            </button>
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
  <button className={[s.service, props.active ? s.active : ''].join(' ')} {...filterOut(props, ['active', 'category'])}>
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
