var browserify = require('browserify');

// shim some non-CommonJS compatible libraries
require('browserify-shim')(browserify(), {
  jquery: { path: './js/vendor/jquery.min.js', exports: '$' },
  parse: { path: './js/vendor/parse-1.2.2.min.js', exports: 'Parse' },
  gmaps: { path: './js/vendor/googlemaps.js', exports: 'gmaps' }
})

// use hbsfy transform to support requiring .hbs files
.transform('hbsfy')

// add entry point; browserify begins parsing the AST tree here for require calls
.require('./js/app/admin.js', { entry: true })

// and finally, bundle it all together
.bundle(function (err, src) {
  if (err) return console.error(err);

  require('fs').writeFileSync('./js/static/admin.js', src);
});
