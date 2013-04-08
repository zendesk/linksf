var browserify = require('browserify'),
    shim = require('browserify-shim');

// load library code
output = shim(browserify(), {
  jquery: { path: './js/vendor/jquery.min.js', exports: '$' },
  parse: { path: './js/vendor/parse-1.2.2.min.js', exports: 'Parse' },
  gmaps: { path: './js/vendor/googlemaps.js', exports: 'gmaps' }
});

// load application code
[
  './js/app/views/admin_view.js'
].forEach(function(modules) {
  require('glob')(modules, function(er, files) {
    files.forEach(function(file) {
      var name = file
        .replace("./js/app/","")
        .replace(/\.js$/,"");

      output = output.require(file, {expose: name});
    });
  });
})

// and finally, load entry point
output = output.require(require.resolve('./js/app/admin.js'), { entry: true });

output.bundle(function (err, src) {
  if (err) return console.error(err);

  require('fs').writeFileSync('./js/static/admin.js', src);
  console.log('Build succeeded');
});
