module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['js/app/**/*.js'],
      options: {
        globals: {
          console: true,
          module: true,
          require: true
        },
        undef: true
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

    var browserify  = require('browserify'),
        shim        = require('browserify-shim'),
        entryPoints = [ './js/app/index.js',
                        './js/app/fixture.js' ],
        moduleList  = [ './js/app/models/*.js' ];

    var addEntryPoint = function(r, entryPoint) {
      return r.require(require.resolve(entryPoint), { entry: true })
    };

    var output = shim(browserify(), {
      jquery: { path: './js/vendor/jquery.min.js', exports: '$' }
    })
      .require('underscore', {expose: "underscore"})
      .require('backbone', {expose: "backbone"})
      .require(require.resolve('./js/shims/parse.js'), {expose: "parse"})
      .require(require.resolve('./js/shims/google-maps.js'), {expose: "google-maps"});

    entryPoints.forEach(function(entryPoint) {
      output = addEntryPoint(output, entryPoint);
    });

    moduleList.forEach(function(modules) {
      require('glob')(modules, function(er, files) {
        files.forEach(function(file) {
          var name = file
            .replace("./js/app/","")
            .replace(/\.js$/,"");
          output = output.require(require.resolve(file),
                                  {expose: name});
        });
      });

    });

    output.bundle(function (err, src) {
      if (err) return console.error(err);

      require('fs').writeFileSync("./js/static/output.js", src);
    });

  });

  grunt.registerTask('default', ['jshint', 'browserify']);

};
