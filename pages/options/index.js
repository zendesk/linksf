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
      showHours: false,
      sortByDistance: false
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

  toggleHours = () => {
    this.setState({ showHours: !this.state.showHours })
    if(this.state.showHours) {
      this.setHours('open')
      this.setState({ hours: 'open' })
    }
    else {
      this.setHours('all')
      this.setState({ hours: 'all' })
    }
  }

  toggleDistance = () => {
    this.setState({ sortByDistance: !this.state.sortByDistance })
    if(this.state.sortByDistance) {
      this.setSortBy('distance')
      this.setState({ sortBy: 'distance' })
    }
    else {
      this.setSortBy('name')
      this.setState({ sortBy: 'name' })
    }
  }

  render() {
    const { taxonomies, sortBy, hours, services, demographics, gender, showHours, sortByDistance } = this.state

    return (
      <Layout>
        <div className={s.page}>
          <ButtonGroup>
            <Group class={s.buttonContainer}>
              <ToggleButton
                label="Open now"
                enabled={showHours}
                onClick={() => this.toggleHours()}
              />
              <ToggleButton
                label="Sort by distance"
                enabled={sortByDistance}
                onClick={() => this.toggleDistance()}
                disableButton={'disabled'}
              />
            </Group>
            <div className={s.alert}>
              <strong>Distance disabled:</strong> current location unavailable
            </div>
          </ButtonGroup>
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
            <ServiceGroup>
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
            </ServiceGroup>
          </Group>
          <div>
            <button className={s.searchButton}>Search</button>
          </div>
        </div>
      </Layout>
    )
  }
}

const ToggleButton = (props) => (
  <button
    className={`${s.toggleButton} ${props.enabled ? s.enabled : ''}`}
    onClick={props.onClick}
    title={props.label}
    // disabled={props.disableButton}
  >
  {props.label}
  </button>
)

const Group = (props) => (
  <div {...props} className={props.class}>
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
