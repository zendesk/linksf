import icons from '../icons/css/icons.css'
import { capitalize } from './stringHelpers'

export const gender = [
  { icon: icons.iconUser, name: 'Male', key: 'M'},
  { icon: icons.iconUserWoman, name: 'Female', key: 'F'},
  { icon: icons.iconUserPair, name: 'All', key: ''}
]

export const age = [
  { name: 'Children', key: 'C'},
  { name: 'Youth', key: 'Y'},
  { name: 'Adult', key: 'A'},
  { name: 'Senior', key: 'S' }
]
