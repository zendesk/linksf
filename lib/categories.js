import icons from '../icons/css/icons.css'

const capitalize = (string) => string && string[0].toUpperCase() + string.slice(1)

export const getIcon = (taxonomy) => icons[`icon${capitalize(taxonomy)}`]

export const relevantTaxonomies = (services) => (
  Array.from(new Set(services.map(service => service.taxonomy)))
)
