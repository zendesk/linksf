function trackDetailsAction(action, opts) {
  opts = opts || {};
  Parse.Analytics.track('detailsPageAction', { action: action });
  var detailsAction = 'details' + action.charAt(0).toUpperCase() + action.substring(1);
  if ( opts.location && opts.location.lat && opts.location.lon ) {
    trackLocation(detailsAction, opts.location);
  }
  ga('send', 'event', 'external_link', action, opts.externalLinkTarget);
}

function trackListAction(action, opts) {
  opts = opts || {};
  Parse.Analytics.track('listPageAction', { action: action, target: opts.target });
  var listAction = 'list' + action.charAt(0).toUpperCase() + action.substring(1);
  if ( opts.location && opts.location.lat && opts.location.lon ) {
    trackLocation(listAction, opts.location);
  }
}

function trackHomepageAction(category) {
  var dimensions = {
    action: 'category',
    category: category
  };
  Parse.Analytics.track('homePageAction', dimensions);
}

function trackRoute(route) {
  Parse.Analytics.track('visit', { page: route, platform: window.navigator.platform, userAgent: window.navigator.userAgent });
  ga('send', 'pageview', '/#' + route);
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
  ga('send', 'event', 'geo_location', action, string);
}

module.exports = {
  trackDetailsAction:  trackDetailsAction,
  trackHomepageAction: trackHomepageAction,
  trackListAction:     trackListAction,
  trackLocation:       trackLocation,
  trackRoute:          trackRoute,
  trackQuery:          trackQuery
};
