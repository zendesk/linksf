import icons from '../icons/css/icons.css'
import { capitalize } from './stringHelpers'

// This will eventually come from Firebase, but currently this is where you have
// to set your available categories.
export const categories = [
  { icon: icons.iconHousing, name: 'Shelter', taxonomy: 'housing' },
  { icon: icons.iconFood, name: 'Food', taxonomy: 'food' },
  { icon: icons.iconMedical, name: 'Medical', taxonomy: 'medical' },
  { icon: icons.iconHygiene, name: 'Hygiene', taxonomy: 'hygiene' },
  { icon: icons.iconTechnology, name: 'Technology', taxonomy: 'technology' },
]

export const getIcon = (taxonomy) => icons[`icon${capitalize(taxonomy)}`]

export const relevantTaxonomies = (services) => {
  const servicesList = Object.values(services)
  return Array.from(new Set(servicesList && servicesList.map(service => service.taxonomy)))
}

export const buildCategories = (categoryNames) => (
  categoryNames.map(name => (
    { icon: icons.iconHome, name: capitalize(name) }
  ))
)
