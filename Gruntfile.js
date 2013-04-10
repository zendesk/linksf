module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['js/app/**/*.js', 'js/shims/**/*.js'],
      options: {
        globals: {
          console: true,
          module: true,
          require: true,
          navigator: true,
          Parse: true
        },
        undef: true,
        debug: true
      }
    },
    watch: {
      files: ['Gruntfile.js', '<%= jshint.files %>', 'js/app/**/*.hbs', 'index.html'],
      tasks: ['jshint', 'browserify']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('browserify', 'Browserify and concatenate app sources', function() {

    var browserify  = require('browserify'),
        shim        = require('browserify-shim'),
        done        = this.async();

    // this will be the js src'd in <script> tags
    var output;

    // vendor js
    output = shim(browserify(), {
      jquery: { path: './js/vendor/jquery.min.js', exports: '$' },
      'jquery-serialize-object': { path: './js/vendor/jquery.serialize-object.js', exports: '' }
    })
      .require('./js/shims/parse.js', {expose: 'parse'})
      .require('./js/shims/google-maps.js', {expose: 'google-maps'});

    // use hbsfy transform to support requiring .hbs files
    output = output.transform('hbsfy');

    // application modules
    //   note: this is optional as browserify traverses the AST from the entry point for require calls.
    //   this gives us consistent require paths by exposing modules using a nicer name.
    [
      './js/app/lib/*.js',
      './js/app/models/*.js',
      './js/app/routers/*.js',
      './js/app/views/*.js',
      './js/app/templates/*.hbs'
    ].forEach(function(modules) {
      require('glob')(modules, function(er, files) {
        files.forEach(function(file) {
          var name = file
            .replace('./js/app/','')
            .replace(/\.(js|hbs)$/,'');

          output = output.require(file, {expose: name});
        });
      });
    });

    // add our entry point
    output = output.require('./js/app/index.js', { entry: true });

    // now bundle it all up!
    output.bundle(function (err, src) {
      if (err) return console.error(err);

      require('fs').writeFileSync("./js/static/output.js", src);

      // keep grunt alive until the write stream completes
      done();
    });
  });

  grunt.registerTask('default', ['jshint', 'browserify']);
};
