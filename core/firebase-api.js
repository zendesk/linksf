import Firebase from 'firebase'

const ref = new Firebase('https://vivid-inferno-4672.firebaseio.com')

// Fetches an organization with its services. Returns a Promise
export function fetchOrganization(id) {
  let organizationOut
  return ref.child(`organizations/${id}`).once('value').then((orgRes) => {
    //  Return the actual service object rather than the ugly firebase object
    organizationOut = orgRes.val()
    return organizationOut
  })
  .then((organization) => {
    // use the service to fetch an organization
    return ref.child('services').orderByChild('organization').equalTo(organization.id).once('value')
  })
  .then((services) => {
    // Append the organization to the service
    const servicesObj = services.val()
    organizationOut.services = Object.keys(servicesObj).map(key => servicesObj[key])
    return ref.child('regular_schedules').orderByChild('organization_id')
                                         .equalTo(organizationOut.id)
                                         .once('value')
  })
  .then((hours) => {
  // TODO: Format the hours so that they are part of their respective 'service' objects
    const hoursObj = hours.val()
    organizationOut.service_hours = Object.keys(hoursObj).map(key => hoursObj[key])
    return ref.child(`phones/${id}`).once('value')
  })
  .then((phones) => {
  // Add array of org's phone #'s
    organizationOut.phones = phones.val()
    return ref.child(`locations/${id}`).once('value')
  })
  .then((location) => {
  // Add array of org's location info
    organizationOut.location = location.val()
    return organizationOut
  })
}

// Fetchs all available categories
export function fetchCategories() {
  return ref.child('taxonomies').once('value').then((res) => {
    // Return an array of categories
    return res.val()
  })
}
