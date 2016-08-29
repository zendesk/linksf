import icons from '../icons/css/icons.css'
import { capitalize } from './stringHelpers'

export const getIcon = (taxonomy) => (
  icons[`icon${capitalize(taxonomy)}`]
)

export const taxonomiesWithIcons = (taxonomies) => (
  taxonomies.map(taxonomy => (
    { icon: getIcon(taxonomy), name: capitalize(taxonomy) }
  ))
)