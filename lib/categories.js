import icons from '../icons/css/icons.css'
import { capitalize } from './stringHelpers'

export const categories = [
  { icon: icons.iconHousing, name: 'Shelter' },
  { icon: icons.iconFood, name: 'Food' },
  { icon: icons.iconMedical, name: 'Medical' },
  { icon: icons.iconHygiene, name: 'Hygiene' },
  { icon: icons.iconTechnology, name: 'Technology' },
]

export const getIcon = (taxonomy) => icons[`icon${capitalize(taxonomy)}`]

export const relevantTaxonomies = (services) => (
  Array.from(new Set(services.map(service => service.taxonomy)))

export const buildCategories = (categoryNames) => (
  categoryNames.map(name => (
    { icon: icons.iconHome, name: capitalize(name) }
  ))
)
