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
      gender: 'All',
      showHours: false,
      sortByDistance: false,
      showDropDown: false,
      // TODO
      genders: ['All', 'Men', 'Women']
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

  toggleDropdown() {
    this.setState({ showDropDown: !this.state.showDropDown })
  }

  setCurrentGender(g) {
    if(g === 'Men')
      this.setState({ gender: 'Men' })
    else if(g === 'Women')
      this.setState({ gender: 'Women' })
    else
      this.setState({ gender: 'All' })

    this.setState({ showDropDown: false })
  }

  toggleHours() {
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

  toggleDistance() {
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
    const { taxonomies, sortBy, hours, services, demographics, gender, genders, showHours, sortByDistance, showDropDown } = this.state

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

          <ButtonGroup>
            <ToggleButton
              label="Welcomes: "
              gender={gender}
              onClick={() => this.toggleDropdown()}
              class={s.genderButton}
              genderLabel={s.genderLabel}
            />
            <ul className={`${s.dropDown} ${showDropDown ? s.enabled : ''}`}>
              {genders.map((label) => (
                <li onClick={() => this.setCurrentGender(label)}>
                  {label}
                </li>
              ))}
            </ul>
          </ButtonGroup>

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
              <DemographicsButton
                onClick={() => this.toggleDemographic('C')}
                active={demographics.C}
              >Children
              </DemographicsButton>
              <DemographicsButton
                onClick={() => this.toggleDemographic('Y')}
                active={demographics.Y}
              >Youth
              </DemographicsButton>
              <DemographicsButton
                onClick={() => this.toggleDemographic('A')}
                active={demographics.A}
              >Adults
              </DemographicsButton>
              <DemographicsButton
                onClick={() => this.toggleDemographic('S')}
                active={demographics.S}
              >Seniors
              </DemographicsButton>
            </ServiceGroup>
          </Group>
          {/*<div>
            <button className={s.searchButton}>Search</button>
          </div>*/}
        </div>
      </Layout>
    )
  }
}

const ToggleButton = (props) => (
  <button
    className={`${s.toggleButton} ${props.class} ${props.enabled ? s.enabled : ''}`}
    onClick={props.onClick}
    title={props.label}
  >
  <span className={props.genderLabel}>{props.label}</span> {props.gender}
  </button>
)

const Group = (props) => (
  <div {...props} className={props.class}>
    {props.children}
  </div>
)

const Title = (props) => (
  <h1 className={s.header} {...props}></h1>
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
    <span className={s.categoryTitle}>{props.category.name}</span>
    <i className={`${props.active ? icons.iconCheck:icons.iconCheckEmpty} ${s.checkBox}`}></i>
  </button>
)

const DemographicsButton = (props) => (
  <button className={[s.button, s.demographicsButton, props.active ? s.active : ''].join(' ')} {...filterOut(props, ['active'])}>
    <span className={s.demographicsTitle}>{props.children}</span>
    <i className={`${props.active ? icons.iconCheck:icons.iconCheckEmpty} ${s.checkBox}`}></i>
  </button>
)

export default OptionsPage
