var browserify = require('browserify');

// shim some non-CommonJS compatible libraries
var o = require('browserify-shim')(browserify(), {
  jquery: { path: './js/vendor/jquery.min.js', exports: '$' },
  parse: { path: './js/vendor/parse-1.2.2.min.js', exports: 'Parse' },
  gmaps: { path: './js/vendor/googlemaps.js', exports: 'gmaps' }
});

// load application code
[
  './js/app/lib/*.js',
  './js/app/models/*.js',
  './js/app/views/*.js',
  './js/app/templates/*.hbs'
].forEach(function(modules) {
  require('glob')(modules, function(er, files) {
    files.forEach(function(file) {
      var name = file
        .replace("./js/app/","")
        .replace(/(.js|.hbs)$/,"");

      o = o.require(file, {expose: name});
    });
  });
});
// use hbsfy transform to support requiring .hbs files
o = o.transform('hbsfy');

// add entry point; browserify begins parsing the AST tree here for require calls
o = o.require('./js/app/admin.js', { entry: true });

// and finally, bundle it all together
o.bundle(function (err, src) {
  if (err) return console.error(err);

  require('fs').writeFileSync('./js/static/admin.js', src);
});
