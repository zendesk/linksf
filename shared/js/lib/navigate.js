module.exports  = function navigate(options) {
  var route  = 'query',
      params = [],
      router = require('routers/router').instance();

  if (options.categories.length > 0) {
    params.push("categories=" + options.categories.join(","));
  }

  if (options.demographics.length > 0) {
    params.push("demographics=" + options.demographics.join(","));
  }

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
