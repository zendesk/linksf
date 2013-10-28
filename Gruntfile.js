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
      shared: [
        'vendor/js/jquery-2.0.3.js',
        'vendor/js/jquery.serialize-object.js',
        'vendor/js/underscore.js',
        'vendor/js/backbone-1.1.0.js',
        'vendor/js/parse-1.2.12.js'
      ],

      shared_minified: [
        'vendor/js/jquery-2.0.3.min.js',
        'vendor/js/jquery.serialize-object.min.js',
        'vendor/js/underscore.min.js',
        'vendor/js/backbone-1.1.0.min.js',
        'vendor/js/parse-1.2.12.min.js'
      ],

      vendor_app: {
        src: ['<%= concat.shared %>', 'vendor/js/fastclick.js'],
        dest: 'build/vendor_app.js'
      },

      vendor_app_min: {
        src: ['<%= concat.shared_minified %>', 'vendor/js/fastclick.min.js'],
        dest: 'build/vendor_app.min.js'
      },

      vendor_admin: {
        src: [
          '<%= concat.shared %>',
          'vendor/js/backbone_filters.js',
          'vendor/js/jquery.autosize.js'
        ],
        dest: 'build/vendor_admin.js'
      },

      vendor_admin_min: {
        src: [
          '<%= concat.shared_minified %>',
          'vendor/js/backbone_filters.min.js',
          'vendor/js/jquery.autosize.min.js'
        ],
        dest: 'build/vendor_admin.min.js'
      },

      app: {
        src: ['<%= concat.vendor_app.dest %>', 'build/app.js'],
        dest: 'build/linksf.js'
      },

      app_min: {
        src: ['<%= concat.vendor_app_min.dest %>', 'build/app.min.js'],
        dest: 'build/linksf.js'
      },

      admin: {
        src: ['<%= concat.vendor_admin.dest %>', 'build/admin.js'],
        dest: 'build/linksf_admin.js'
      },

      admin_min: {
        src: ['<%= concat.vendor_admin_min.dest %>', 'build/admin.min.js'],
        dest: 'build/linksf_admin.js'
      }
    },

    uglify: {
      options: {
        mangle: false,
        preserveComments: false,
        report: 'min'
      },

      vendor: {files: {
        'vendor/js/jquery.serialize-object.min.js': 'vendor/js/jquery.serialize-object.js',
        'vendor/js/backbone_filters.min.js': 'vendor/js/backbone_filters.js'
      }},
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

  grunt.registerTask('build:development', [
    'jshint',
    'simplemocha',
    'sass',
    'browserify',
    'concat:vendor_app',
    'concat:app',
    'concat:vendor_admin',
    'concat:admin',
    'cachebuster'
  ]);

  grunt.registerTask('build:production', [
    'jshint',
    'simplemocha',
    'sass',
    'cssmin',
    'browserify',
    'uglify',
    'concat:app_min',
    'concat:vendor_app_min',
    'concat:admin_min',
    'concat:vendor_admin_min',
    'cachebuster'
  ]);

  grunt.registerTask('default', [
    'build:development'
  ]);

  grunt.registerTask('release', [
    'build:production'
  ]);
};
