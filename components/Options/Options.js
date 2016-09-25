import React, { PropTypes } from 'react'
import s from './Options.css'
import icons from '../../icons/css/icons.css'
// import { relevantTaxonomies, getIcon } from '../../lib/categories'
import Button from '../Button'

const Group = (props) => (
  <div {...props} className={s.group}>
    {props.children}
  </div>
)

const Title = (props) => (
  <div className={s.title} {...props}>
    {props.children}
  </div>
)

const ButtonGroup = (props) => (
  <div className={s.title} {...props}>
    {props.children}
  </div>
)

const ServiceFilter = (props) => (
  <div className={s.service}>
    <i className={`${s.categoryIcon} ${props.category.iconClass}`}></i>
    <h3>{props.category.name}</h3>
  </div>
)

const LeftButton = (props) => (
  <button className={[s.button, s.leftButton].join(' ')}>
    {props.children}
  </button>
)

const MiddleButton = (props) => (
  <button className={[s.button, s.middleButton].join(' ')}>
    {props.children}
  </button>
)

const RightButton = (props) => (
  <button className={[s.button, s.rightButton].join(' ')}>
    {props.children}
  </button>
)

const Options = (props) => (
  <div>
    <Group>
      <Title>
        Sort by
      </Title>
      <ButtonGroup>
        <LeftButton>Distance</LeftButton>
        <RightButton>Name</RightButton>
      </ButtonGroup>
    </Group>
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
      <ButtonGroup>
        {props.categories.map(category => <ServiceFilter category={category} />)}
      </ButtonGroup>
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
  </div>
)

export default Options
