module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [
        'js/app/**/*.js',
        'js/shims/**/*.js',
        'test/*.js'
      ],
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
      files: [
        'Gruntfile.js',
        '<%= jshint.files %>',
        'js/app/**/*.hbs',
        'css/main.scss',
        'test/**/*.js',
        'index.html'
      ],
      tasks: [
        'jshint',
        'simplemocha',
        'sass',
        'browserify'
      ]
    },
    simplemocha: {
      options: {
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'list'
      },

      all: { src: ['test/**/*.js'] }
    },
    sass: {
      dist: {
        files: {
          'css/static/output.css': ['css/**/*.scss']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-sass');

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
      .require('./js/shims/modernizr.js', {expose: 'modernizr'})
      .require('./js/shims/google-maps.js', {expose: 'google-maps'})
      .require('lodash', {expose: 'lodash'})
      .require('backbone', {expose: 'backbone'});

    // use hbsfy transform to support requiring .hbs files
    output = output.transform('hbsfy');


    // shared modules.
    // note: these are modules shared between the client and the server

    [
      './js/app/lib/*.js',
      './js/app/models/*.js'
    ].forEach(function(modules) {
      require('glob')(modules, function(er, files) {
        files.forEach(function(file) {
          var name = file
            .replace('./js/app/','')
            .replace(/\.(js|hbs)$/,'');

          output = output.require(file, {expose: "cloud/" + name});
        });
      });
    });

    // application modules
    //   note: this is optional as browserify traverses the AST from the entry point for require calls.
    //   this gives us consistent require paths by exposing modules using a nicer name.
    [
      './js/app/lib/*.js',
      './js/app/models/*.js',
      './js/app/collections/*.js',
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

  grunt.registerTask('default', ['jshint', 'simplemocha', 'sass', 'browserify']);
};
