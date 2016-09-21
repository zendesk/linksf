//categories=housing&
 //demographics=C,Y,A&
 //gender=F&
 //sort=name&
 //hours=open

options = {
  categories: [],
  demographics: '',
  gender: '',
  sort: 'name',
  hours: 'open'
}

export filterLocationsByOptions = (locations, options) {
  filterHelper(Object.keys(options))
}

const ref = new Firebase("https://vivid-inferno-4672.firebaseio.com/");
const PAGINATION_VAL = 50

const date = new Date();

const milTime = date.getHours() * 100 + date.getMinutes()

const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']


 //categories=housing&
 //demographics=C,Y,A&
 //gender=F&
 //sort=name&
 //hours=open

 // TODO: Allow a list of 'desired' filters to be passed in and only filter the locations based on those
// parameters

// Takes an array of locations and an array of filter options and returns
// the filtered array
function filterHelper(locations, ...filters) {
  return filterFunctions(filters).reduce((result, filterFn) => result.filter(filterFn), [])
}

// Returns an array of functions used to filter locations. Currently passes location list through all
// filters
function filterFunctions(desiredFilters) {

 const filters = {
   services: servicesFilter(location) => {
   		return location.services
   },
   open: openNowFilter({services}) => {
      return services.some((service)=>
      	 service.schedules && service.schedules[0].some((schedule) =>
         	 schedule.opens_at <= milTime &&
          			 schedule.closes_at >= milTime &&
                 schedule.weekday === weekdays[date.getDay()])
      )
   },
   eligibility: eligibilityFilter({services}) => {
   		const ages = eligibility.age ? eligibility.age.join('') : '' //Ex: 'C,Y,A'
      var agesRegExp = new RegExp(`[${ages}]`, "i")
      const genders = eligibility.gender
      console.log(services)
      return services.some((service)=> {
      //TODO: Split ternary up into separate bool expressions
      console.log(service.eligibility)
   		 return service.eligibility.gender === "" ? true : genders === service.eligibility.gender &&
       ages === '' ? true : (!service.eligibility.age || agesRegExp.test(service.eligibility.age.join('')))
       })
   },
 }

 return desiredFilters.map(filterName => filters[filterName]);
}

//If we are given eligibility.age => make sure service.eligibility.age matches
//Otherwise, we don't care
