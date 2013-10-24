module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [
        'app/**/*.js',
        'admin/**/*.js',
        'test/**/*.js',
        'shared/**/*.js',
        'server/**/*.js'
      ],
      options: {
        globals: {
          window: true,
          document: true,
          navigator: true,
          console: true,
          module: true,
          require: true,
          FastClick: true,
          $: true,
          Backbone: true,
          Parse: true,
          Handlebars: true,
          _: true,
          google: true
        },
        undef: true,
        debug: true,
        '-W030': true
      }
    },

    simplemocha: {
      options: {
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'list'
      },

      all: {
        src: 'test/**/*.js'
      }
    },

    watch: {
      files: [
        'Gruntfile.js',
        'app/**/*',
        'admin/**/*',
        'shared/**/*',
        'server/**/*',
        'test/**/*'
      ],
      tasks: ['default']
    },

    sass: {
      app: {
        files: {
          'build/linksf.css': [
            'vendor/css/normalize.min.css',
            'vendor/css/icons.css',
            'shared/css/**/*',
            'app/css/**/*.scss'
          ],
        }
      },
      admin: {
        files: {
          'build/linksf_admin.css': [
            'vendor/css/normalize.min.css',
            'vendor/css/icons.css',
            'shared/css/**/*',
            'admin/css/**/*.scss'
          ],
        }
      }
    },

    browserify: {
      options: { transform: ['hbsfy'] },
      app: {
        src: 'app/js/app.js',
        dest: 'build/app.js',
        options: {
          aliasMappings: [
            { cwd: 'shared/js/lib',         src: '*.js',  dest: 'shared/lib' },
            { cwd: 'shared/js/models',      src: '*.js',  dest: 'shared/models' },
            { cwd: 'shared/js/collections', src: '*.js',  dest: 'shared/collections' },
            { cwd: 'shared/js/views',       src: '*.js',  dest: 'shared/views' },
            { cwd: 'shared/js/templates',   src: '*.hbs', dest: 'shared/templates' },
            { cwd: 'app/js/lib',            src: '*.js',  dest: 'lib' },
            { cwd: 'app/js/models',         src: '*.js',  dest: 'models' },
            { cwd: 'app/js/collections',    src: '*.js',  dest: 'collections' },
            { cwd: 'app/js/routers',        src: '*.js',  dest: 'routers' },
            { cwd: 'app/js/templates',      src: '*.hbs', dest: 'templates' },
            { cwd: 'app/js/views',          src: '*.js',  dest: 'views' }
          ]
        }
      },
      admin: {
        src: 'admin/js/admin.js',
        dest: 'build/admin.js',
        options: {
          aliasMappings: [
            { cwd: 'shared/js/lib',         src: '*.js',  dest: 'shared/lib' },
            { cwd: 'shared/js/models',      src: '*.js',  dest: 'shared/models' },
            { cwd: 'shared/js/collections', src: '*.js',  dest: 'shared/collections' },
            { cwd: 'shared/js/views',       src: '*.js',  dest: 'shared/views' },
            { cwd: 'shared/js/templates',   src: '*.hbs', dest: 'shared/templates' },
            { cwd: 'admin/js/lib',          src: '*.js',  dest: 'lib' },
            { cwd: 'admin/js/models',       src: '*.js',  dest: 'models' },
            { cwd: 'admin/js/collections',  src: '*.js',  dest: 'collections' },
            { cwd: 'admin/js/routers',      src: '*.js',  dest: 'routers' },
            { cwd: 'admin/js/templates',    src: '*.hbs', dest: 'templates' },
            { cwd: 'admin/js/views',        src: '*.js',  dest: 'views' }
          ]
        }
      }
    },

    cssmin: {
      app: {
        src: 'build/linksf.css',
        dest: 'build/linksf.css'
      },
      admin: {
        src: 'build/linksf_admin.css',
        dest: 'build/linksf_admin.css'
      },
    },

    concat: {
      vendor_dev: {
        src: [
          'vendor/js/jquery-2.0.3.js',
          'vendor/js/jquery.serialize-object.js',
          'vendor/js/underscore.js',
          'vendor/js/backbone-1.1.0.js',
          'vendor/js/backbone_filters.js',
          'vendor/js/handlebars.js',
          'vendor/js/fastclick.js',
          'vendor/js/parse-1.2.12.js'
        ],
        dest: 'build/vendor.js'
      },

      vendor_prod: {
        src: [
          'vendor/js/jquery-2.0.3.min.js',
          'vendor/js/handlebars.min.js',
          'vendor/js/parse-1.2.12.min.js'
        ],
        dest: 'build/vendor.min.js'
      },

      app_dev: {
        src: ['build/vendor.js', 'build/app.js'],
        dest: 'build/linksf.js'
      },

      app_prod: {
        src: ['build/vendor.min.js', 'build/app.min.js'],
        dest: 'build/linksf.js'
      },

      admin_dev: {
        src: ['build/vendor.js', 'build/admin.js'],
        dest: 'build/linksf_admin.js'
      },

      admin_prod: {
        src: ['build/vendor.min.js', 'build/admin.min.js'],
        dest: 'build/linksf_admin.js'
      }
    },

    uglify: {
      options: {
        mangle: false,
        preserveComments: false,
        report: 'min'
      },

      vendor: {files: {}},
      app: {files: {'build/app.min.js': 'build/app.js'}},
      admin: {files: {'build/admin.min.js': 'build/admin.js'}}
    },

    cachebuster: {
      dist: {
        files: {
          src: [
            'build/linksf.js',
            'build/linksf.css',
            'build/linksf_admin.js',
            'build/linksf_admin.css'
          ],
        },
        options: {
          complete: function(hashes) {
            // ugly but the only way to tag each file with a key
            var keyMap = {
                'build/linksf.js': 'linksf_js',
                'build/linksf.css': 'linksf_css',
                'build/linksf_admin.js': 'linksf_admin_js',
                'build/linksf_admin.css': 'linksf_admin_css'
               },
               context = {},
               Handlebars = require('handlebars'),
               template,
               output;

            Object.keys(hashes).forEach(function(key) {
              var matches = key.match(/^build\/(.*)(\..*)$/),
                  // outputFile = matches[1] + '-' + hashes[key] + matches[2];
                  outputFile = matches[1] + matches[2];

              // grunt.file.copy(key, outputLocation);
              context[keyMap[key]] = outputFile;
            });

            template = Handlebars.compile(grunt.file.read('app/index.html'));
            output = template(context);
            grunt.file.write('build/index.html', output);

            template = Handlebars.compile(grunt.file.read('admin/admin.html'));
            output = template(context);
            grunt.file.write('build/admin.html', output);
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-cachebuster');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('validate', [ 'jshint', 'simplemocha' ]);

  grunt.registerTask('build', [
    'validate',
    'sass:app',
    'sass:admin',
    'concat:vendor_dev',
    'browserify:app',
    'browserify:admin'
  ]);

  grunt.registerTask('concat:dev', [
    'concat:app_dev',
    'concat:admin_dev'
  ]);

  grunt.registerTask('concat:prod', [
    'concat:vendor_prod',
    'concat:app_prod',
    'concat:admin_prod'
  ]);

  grunt.registerTask('uglify:all', [
    'uglify:vendor',
    'uglify:app',
    'uglify:admin'
  ]);

  grunt.registerTask('cssmin:all', [
    'cssmin:app',
    'cssmin:admin'
  ]);

  grunt.registerTask('default', [
    'build',
    'concat:dev',
    'cachebuster'
  ]);

  grunt.registerTask('release', [
    'build',
    'uglify:all',
    'cssmin:all',
    'concat:prod',
    'cachebuster'
  ]);
};
