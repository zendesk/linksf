import R from 'ramda'
import { relevantTaxonomies } from './taxonomies'

const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']


export const isOpen = (services) => {
  const now = new Date()
  const currentTime = now.getHours() * 100 + now.getMinutes()
  const currentDay = weekdays[now.getDay()].toLowerCase()

  const isBetween = (num, min, max) => (
    num > min && num < max
  )

  const scheduleContainsCurrentTime = (schedule) => (
    currentDay === schedule.weekday.toLowerCase() &&
      isBetween(currentTime, schedule.opensAt, schedule.closesAt)
  )

  const serviceHasMatchingSchedule = (service) => {
    if (!service.schedules) return true
    return (service.schedules).some(scheduleContainsCurrentTime)
  }

  return Object.values(services).some(serviceHasMatchingSchedule)
}

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

// type LocationFilterOptions = {
//   location : Location,
//   options : FilterOptions,
//   isValid : Bool,
// }


const DEFAULT_FILTER_OPTIONS = {
  categories: [],
  demographics: [],
  gender: '',
  hours: '',
}

// (List a, List b) -> Bool
const doesIntersect = (list1, list2) => {
  return list1.some(item => list2.includes(item))
}

// LocationFilterOptions -> LocationFilterOptions
export function categoriesFilter(locationOptions) {
  const { location, options: { categories }, isValid } = locationOptions
  if (!isValid || categories.length === 0) return locationOptions
  const locationCategories = relevantTaxonomies(location.services)

  const isStillValid = doesIntersect(categories, locationCategories)
  return { ...locationOptions, isValid: isStillValid }
}

// LocationFilterOptions -> LocationFilterOptions
function demographicsFilter(locationOptions) {
  const { location, options: { demographics }, isValid } = locationOptions
  if (!isValid || demographics.length === 0) return locationOptions

  const { services } = location

  const isStillValid = Object.values(services).some(service => {
    const { eligibility: { age } } = service
    if (!age) return true
    return doesIntersect(demographics, age)
  })

  return { ...locationOptions, isValid: isStillValid }
}

// LocationFilterOptions -> LocationFilterOptions
function genderFilter(locationOptions) {
  const { location, options, isValid } = locationOptions
  if (!isValid || options.gender === '') return locationOptions
  const { services } = location

  const isStillValid = Object.values(services).some(service => {
    const { eligibility: { gender } } = service
    if (!gender) return true
    return gender === options.gender
  })
  return { ...locationOptions, isValid: isStillValid }
}

// LocationFilterOptions -> LocationFilterOptions
function hoursFilter(locationOptions) {
  const { location, options, isValid } = locationOptions
  if (!isValid || options.hours === '') return locationOptions
  const { services } = location

  const isStillValid = isOpen(services)

  return {...locationOptions, isValid: isStillValid }
}

// LocationFilterOptions -> Bool
function filterByOptions(locationAndFilterOptions) {
  return R.pipe(
    categoriesFilter,
    demographicsFilter,
    genderFilter,
    hoursFilter
  )(locationAndFilterOptions).isValid
}

// String -> FilterOptions
function mapOptionsStringToFilterOptions(optionsString) {
  const filters = optionsString.split('&').filter(e => e !== '')
  return filters.reduce((desired, filterString) => {
    const isArrayValues = filterString.includes('[]')
    const splitter = isArrayValues ? '[]=' : '='
    const [filterName, filterValue] = filterString.split(splitter)
    const newDesired = desired
    newDesired[filterName] = isArrayValues ? filterValue.split(',') : filterValue
    return newDesired
  }, DEFAULT_FILTER_OPTIONS)
}

// (String, List Location) -> List Location
export function filterByOptionsString(optionsString, locations) {
  const optionsData = mapOptionsStringToFilterOptions(optionsString)
  if (!optionsString.includes('hours=open')) {
    optionsData['hours'] = '' // this is a hack since i'm not sure why hours was still staying 'open' *scratches head*
    // TODO: works fine but should circle back on this!
  }

  return locations.filter(location => location.services &&
    filterByOptions({ location, options: optionsData, isValid: true })
  )
}
