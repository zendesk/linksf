import R from 'ramda'
import { relevantTaxonomies } from './taxonomies'

const date = new Date()
const milTime = date.getHours() * 100 + date.getMinutes()
const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

// Types!
//
// -- = example
//
// type FilterOptions = {
//   categories : List String  --  [ 'food', 'housing', 'etc'],
//   demographics : List String  --  ['C', 'Y', 'A', 'S'],
//   gender : String  --  'F',
//   hours : String  --  'all',
// }

// type LocationOptions = {
//   location : Location,
//   options : FilterOptions,
//   isValid : Bool,
// }
//

const doesIntersect = (list1, list2) => {
  return list1.some(item => list2.includes(item))
}

function categoriesFilter(locationOptions) {
  const { location, options: { categories }, isValid } = locationOptions
  if (!isValid) return locationOptions
  const locationCategories = relevantTaxonomies(location.services)
  const locationHasCategory = category => locationCategories.includes(category)
  const isStillValid = doesIntersect(categories, locationCategories)
  return { ...locationOptions, isValid: isStillValid }
}


function demographicsFilter(locationOptions) {
  const { location, options: { demographics }, isValid } = locationOptions
  if (!isValid) return locationOptions

  const { services } = location

  const isStillValid = services.some(service => {
    const { eligibility: { age } } = service
    if (!age) return true
    return doesIntersect(demographics, age)
  })

  return { ...locationOptions, isValid: isStillValid }
}

function genderFilter(locationOptions) {
  const { location, options, isValid } = locationOptions
  if (!isValid) return locationOptions
  const { services } = location

  const isStillValid = services.some(service => {
    const { eligibility: { gender } } = service
    if (!gender) return true
    return gender === options.gender
  })
  return { ...locationOptions, isValid: isStillValid }
}

function hoursFilter(locationOptions) {
  const { location, options, isValid } = locationOptions
  if (!isValid) return locationOptions
  const { services } = location

  return services.some(service =>
  	 service.schedules && service.schedules[0].some(schedule =>
     	 schedule.opens_at <= milTime &&
      			 schedule.closes_at >= milTime &&
             schedule.weekday === weekdays[date.getDay()])
  )
}


const DEFAULT_FILTER_OPTIONS = {
  categories: [],
  demographics: [],
  gender: '',
  hours: 'all',
}

function filterByOptions(locationAndFilterOptions) {
  return R.pipe(
    categoriesFilter(locationAndFilterOptions),
    demographicsFilter,
    genderFilter,
    hoursFilter
  ).isValid
}

function mapOptionsStringToData(optionsString) {
  const filters = optionsString.split('&')
  return filters.reduce((desired, filterString) => {
    const isArrayValues = filterString.includes('[]')
    const splitter = isArrayValues ? '[]=' : '='
    const [filterName, filterValue] = filterString.split(splitter)
    const newDesired = desired
    newDesired[filterName] = isArrayValues // i hate javascript
      ? filterValue.join(',') :
      filterValue
    return newDesired
  }, DEFAULT_FILTER_OPTIONS)
}

export function filterByOptionsString(locations, optionsString) {
  const optionsData = mapOptionsStringToData(optionsString)

  return locations.filter(location => filterByOptions(
    { location, optionsData, isValid: true }
  ))
}
