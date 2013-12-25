module.exports  = function navigate(options) {
  var route  = 'query',
      params = [],
      router = require('routers/router').instance();

  [ "categories", "demographics" ].forEach(function(key) {
    if (options[key] && options[key].length > 0) {
      params.push(key + "=" + options[key].join(","));
    }
  });

  [ "gender", "sort", "hours", "search" ].forEach(function(key) {
    if (options[key]) {
      params.push(key + "=" + encodeURIComponent(options[key]));
    }
  });

  if (params.length > 0) {
    route = route + "?" + params.join("&");
  }

  router.navigate(route, { trigger: true });

};
