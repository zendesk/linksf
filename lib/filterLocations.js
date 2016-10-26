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

// type LocationFilterOptions = {
//   location : Location,
//   options : FilterOptions,
//   isValid : Bool,
// }


const DEFAULT_FILTER_OPTIONS = {
  categories: [],
  demographics: [],
  gender: '',
  hours: 'all',
}

// (List a, List b) -> Bool
const doesIntersect = (list1, list2) => {
  return list1.some(item => list2.includes(item))
}

// LocationFilterOptions -> LocationFilterOptions
function categoriesFilter(locationOptions) {
  const { location, options: { categories }, isValid } = locationOptions
  if (!isValid || categories.length === 0) return locationOptions
  // console.log(location)
  // console.log(location)
  const locationCategories = relevantTaxonomies(location.services)
  // const locationHasCategory = category => locationCategories.includes(category)
  // console.log(locationCategories)

  const isStillValid = doesIntersect(categories, locationCategories)
  return { ...locationOptions, isValid: isStillValid }
}

// LocationFilterOptions -> LocationFilterOptions
function demographicsFilter(locationOptions) {
  const { location, options: { demographics }, isValid } = locationOptions
  if (!isValid || demographics.length === 0) return locationOptions

  const { services } = location

  const isStillValid = services.some(service => {
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

  const isStillValid = services.some(service => {
    const { eligibility: { gender } } = service
    if (!gender) return true
    return gender === options.gender
  })
  return { ...locationOptions, isValid: isStillValid }
}

// LocationFilterOptions -> LocationFilterOptions
function hoursFilter(locationOptions) {
  const { location, options, isValid } = locationOptions
  if (!isValid || options.hours === 'all') return locationOptions
  const { services } = location

  return services.some(service =>
  	 service.schedules && service.schedules[0].some(schedule =>
     	 schedule.opens_at <= milTime &&
      			 schedule.closes_at >= milTime &&
             schedule.weekday === weekdays[date.getDay()])
  )
}

// LocationFilterOptions -> Bool
function filterByOptions(locationAndFilterOptions) {
  const something = R.pipe(
    categoriesFilter,
    demographicsFilter,
    genderFilter,
    hoursFilter
  )(locationAndFilterOptions)
  // console.log(something)
  return something.isValid
}

// String -> FilterOptions
function mapOptionsStringToFilterOptions(optionsString) {
  const filters = optionsString.split('&').filter(e => e !== '')
  const things = filters.reduce((desired, filterString) => {
    const isArrayValues = filterString.includes('[]')
    const splitter = isArrayValues ? '[]=' : '='
    const [filterName, filterValue] = filterString.split(splitter)
    const newDesired = desired
    newDesired[filterName] = isArrayValues ? filterValue.split(',') : filterValue
    return newDesired
  }, DEFAULT_FILTER_OPTIONS)
  return things
}

// (String, List Location) -> List Location
export function filterByOptionsString(optionsString, locations) {
  const optionsData = mapOptionsStringToFilterOptions(optionsString)

  return locations.filter(location => filterByOptions(
    { location, options: optionsData, isValid: true }
  ))
}
