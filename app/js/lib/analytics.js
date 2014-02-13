function trackDetailsAction(action, opts) {
  opts = opts || {};
  Parse.Analytics.track('detailsPageAction', { action: action });
  var detailsAction = 'details' + action.charAt(0).toUpperCase() + action.substring(1);
  if (opts.location.lat && opts.location.lon) { trackLocation(detailsAction, opts.location); }
}

function trackHomepageAction(searchTerm, category) {
  var dimensions = {};
  if (searchTerm) {
    dimensions.action = 'search';
  } else {
    dimensions.action   = 'category';
    dimensions.category = category;
  }
  Parse.Analytics.track('homePageAction', dimensions);
}

function trackRoute(route) {
  Parse.Analytics.track('visit', { page: route, platform: window.navigator.platform, userAgent: window.navigator.userAgent });
}

function trackQuery(params) {
  _.keys(params).forEach(function(k) {
    if (_.isEmpty(params[k])) { delete params[k]; }
  });
  if (!_.isEmpty(params)) { Parse.Analytics.track('query', params); }
}

function trackLocation(action, location, params) {
  var string     = [ location.lat, location.lon ].join(':'),
      dimensions = $.extend(true, { action: action, location: string }, params);
  Parse.Analytics.track('location', dimensions);
}

module.exports = {
  trackDetailsAction:  trackDetailsAction,
  trackHomepageAction: trackHomepageAction,
  trackLocation:       trackLocation,
  trackRoute:          trackRoute,
  trackQuery:          trackQuery
};
