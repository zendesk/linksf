import history from '../core/history'

export const redirectTo = (location) => {
  history.push(location)
}
export const redirectToViaReplace = (location) => {
  // Use 'replace' instead of 'push' so that the 'back' button skips filter changes
  history.replace(location)
}

const EMPTY_QUERY = {
  sort: '',
  hours: 'all',
  services: [],
  demographics: [],
  gender: ''
}

export const convertToQueryString = (partsOfQuery) => {
  const query = Object.assign(EMPTY_QUERY, partsOfQuery)
  const { sort, hours, services, demographics, gender } = query
  const sortByString = sort === 'dist' ? '&sort=dist' : ''
  const hoursString = hours === 'open' ? '&hours=open' : ''
  const servicesString = services.length > 0 ?
    `&categories[]=${services.join(',')}` :
    ''
  const demographicsString = demographics.length > 0 ?
    `&demographics[]=${demographics.join(',')}` :
    ''

  const genderString = gender ? `&gender=${gender}` : ''
  const queryString = [sortByString, hoursString, servicesString, demographicsString, genderString].join('')

  return `?${queryString.slice(1, queryString.length)}`
}
