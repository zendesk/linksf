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
        },
        undef: true,
        debug: true
      }
    },
    watch: {
      files: ['Gruntfile.js', '<%= jshint.files %>'],
      tasks: ['jshint', 'browserify']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('browserify', 'Browserify and concatenate app sources', function() {

    // node-style requires in the browser
    var browserify = require('browserify');

    // we have to shim non-exports compliant js libraries :(
    var shim = require('browserify-shim');

    // this will be the js src'd in <script> tags
    var output;

    // require vendor js first
    output = shim(browserify(), {
      jquery: { path: './js/vendor/jquery.min.js', exports: '$' }
    })
      .require('./js/shims/parse.js', {expose: 'parse'})
      .require('./js/shims/google-maps.js', {expose: 'google-maps'})
      .require('underscore', {expose: 'underscore'})
      .require('backbone', {expose: 'backbone'});

    // and our application entry point
    output = output.require('./js/app/index.js', {entry: true});

    // require application modules
    [
      './js/app/models/*.js'
    ].forEach(function(modules) {
      require('glob')(modules, function(er, files) {
        files.forEach(function(file) {
          var name = file
            .replace("./js/app/","")
            .replace(/\.js$/,"");

          output = output.require(file, {expose: name});
        });
      });
    });

    // now bundle it all up!
    output.bundle(function (err, src) {
      if (err) return console.error(err);

      require('fs').writeFileSync("./js/static/output.js", src);
    });
  });

  grunt.registerTask('default', ['jshint', 'browserify']);
};
