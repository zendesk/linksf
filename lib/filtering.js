import R from 'ramda'
import { relevantTaxonomies } from './taxonomies'

const date = new Date()
const milTime = date.getHours() * 100 + date.getMinutes()
const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

// Types!
//
// type FilterOptions = {
//   categories : [],
//   demographics: [],
//   gender: '',
//   sortBy: 'name',
//   hours: 'all',
// }

// type LocationOptions = {
// location : Location
// options : FilterOptions
// isValid : Bool
// }

function categoriesFilter(locationOptions) {
  const { location, options: { categories }, isValid } = locationOptions
  if (!isValid) return locationOptions
  const locationCategories = relevantTaxonomies(location.services)
  const locationHasCategory = category => locationCategories.includes(category)
  return categories.some(locationHasCategory)
}


function demographicsFilter({services}) {
  const ages = eligibility.age ? eligibility.age.join('') : '' //Ex: 'C,Y,A'
  const agesRegExp = new RegExp(`[${ages}]`, 'i')
  const genders = eligibility.gender
  console.log(services)
  return services.some((service) => {
  //TODO: Split ternary up into separate bool expressions
  console.log(service.eligibility)
  	 return service.eligibility.gender === '' ? true : genders === service.eligibility.gender &&
   ages === '' ? true : (!service.eligibility.age || agesRegExp.test(service.eligibility.age.join('')))
   })
}

function genderFilter(locationOptions) {
  return locationOptions
}

function hoursFilter({services}) {
  return services.some((service) =>
  	 service.schedules && service.schedules[0].some((schedule) =>
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
