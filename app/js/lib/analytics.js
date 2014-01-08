function trackRoute(route) {
  Parse.Analytics.track('visit', { page: route });
}

function trackQuery(params) {
  _.keys(params).forEach(function(k) {
    if (_.isEmpty(params[k])) { delete params[k]; }
  });
  if (!_.isEmpty(params)) { Parse.Analytics.track('query', params); }
}

module.exports = {
  trackRoute: trackRoute,
  trackQuery: trackQuery
};
