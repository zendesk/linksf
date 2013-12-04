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
          google: true,
          parseAppKey: true,
          parseJSKey: true
        },
        undef: true,
        debug: true,
        '-W030': true
      }
    },

    // A simple Grunt invoker for mocha tests
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

    // run the 'default' task when any watched files change
    watch: {
      files: [
        'Gruntfile.js',
        'app/**/*',
        'admin/**/*',
        'shared/**/*',
        'server/**/*',
        'vendor/**/*',
        'test/**/*'
      ],
      tasks: ['default']
    },

    sass: {
      // generate app-specific css file
      // sass performs both the processing and concatenation steps for css
      app: {
        src: 'app/css/app.scss',
        dest: 'tmp/linksf.css'
      },

      admin: {
        src: 'admin/css/admin.scss',
        dest: 'tmp/linksf_admin.css'
      }
    },

    // Browserify
    browserify: {
      options: {
        // We want `.hbs` files to be `require`able. We use the hbsfy transform
        // to precompile Handlebars templates and let us require the compiled
        // JavaScript functions.
        transform: ['hbsfy']
      },
      app: {
        // The entry point where Browserify will begin searching the AST for `require` calls
        src: 'app/js/app.js',

        // The built file
        dest: 'tmp/app.js',

        options: {
          // We want alias mappings because we'd rather
          // `require('views/index_view')` than `require('./views/index_view.js')`
          //
          // There is a tradeoff for convenient here - all aliased files are exported
          // into the built app.js file, even if they're never explicitly
          // `require`d from the entry point tree.
          aliasMappings: [
            { cwd: 'shared/js/lib',         src: '*.js',  dest: 'shared/lib' },
            { cwd: 'shared/js/lib',         src: '*.js',  dest: 'cloud/lib' },
            { cwd: 'shared/js/models',      src: '*.js',  dest: 'shared/models' },
            { cwd: 'shared/js/models',      src: '*.js',  dest: 'cloud/models' },
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
      // See browserify:app above
      admin: {
        src: 'admin/js/admin.js',
        dest: 'tmp/admin.js',
        options: {
          aliasMappings: [
            { cwd: 'shared/js/lib',         src: '*.js',  dest: 'shared/lib' },
            { cwd: 'shared/js/lib',         src: '*.js',  dest: 'cloud/lib' },
            { cwd: 'shared/js/models',      src: '*.js',  dest: 'shared/models' },
            { cwd: 'shared/js/models',      src: '*.js',  dest: 'cloud/models' },
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

    // Minify css files
    cssmin: {
      app: {
        src: 'tmp/linksf.css',
        dest: 'tmp/linksf.css'
      },
      admin: {
        src: 'tmp/linksf_admin.css',
        dest: 'tmp/linksf_admin.css'
      },
    },

    // Concatenate files together.
    concat: {
      // Not a target, just a variable that we can interpolate in elsewhere.
      shared_js: [
        'vendor/js/jquery-2.0.3.js',
        'vendor/js/jquery.serialize-object.js',
        'vendor/js/underscore.js',
        'vendor/js/backbone-1.0.0.js',
        'vendor/js/parse-1.2.12.js'
      ],

      shared_js_minified: [
        'vendor/js/jquery-2.0.3.min.js',
        'vendor/js/jquery.serialize-object.min.js',
        'vendor/js/underscore.min.js',
        'vendor/js/backbone-1.0.0.min.js',
        'vendor/js/parse-1.2.12.min.js'
      ],

      // App also uses the vendored fastclick library
      app: {
        src: [
          '<%= concat.shared_js %>',
          'vendor/js/bootstrap-button.js',
          'vendor/js/fastclick.js',
          'tmp/app.js'
        ],
        dest: 'tmp/linksf.js'
      },

      // Concat minified files
      app_min: {
        src: [
          '<%= concat.shared_js_minified %>',
          'vendor/js/bootstrap-button.min.js',
          'vendor/js/fastclick.min.js',
          'tmp/app.min.js'
        ],
        dest: 'tmp/linksf.js'
      },

      // Admin uses backbone filters for authentication and autosize for text entry
      admin: {
        src: [
          '<%= concat.shared_js %>',
          'vendor/js/backbone_filters.js',
          'vendor/js/jquery.autosize.js',
          'vendor/js/bootstrap.js',
          'tmp/admin.js'
        ],
        dest: 'tmp/linksf_admin.js'
      },

      admin_min: {
        src: [
          '<%= concat.shared_js_minified %>',
          'vendor/js/backbone_filters.min.js',
          'vendor/js/jquery.autosize.min.js',
          'vendor/js/bootstrap.min.js',
          'tmp/admin.min.js'
        ],
        dest: 'tmp/linksf_admin.js'
      }
    },

    uglify: {
      options: {
        mangle: false,
        preserveComments: false,
        report: 'min'
      },

      vendor: {
        files: {
          // These libraries are not distributed with minified versions, so we
          // minify them ourselves.
          'vendor/js/jquery.serialize-object.min.js': 'vendor/js/jquery.serialize-object.js',
          'vendor/js/backbone_filters.min.js': 'vendor/js/backbone_filters.js',
          'vendor/js/bootstrap-button.min.js': 'vendor/js/bootstrap-button.js'
        }
      },
      app: {files: {'tmp/app.min.js': 'tmp/app.js'}},
      admin: {files: {'tmp/admin.min.js': 'tmp/admin.js'}}
    },

    clean: {
      build: {
        src: 'build/*',
        filter: function(filepath) { return filepath !== 'build/.gitkeep'; }
      }
    },

    cachebuster: {
      dist: {
        files: {
          src: [
            'tmp/linksf.js',
            'tmp/linksf.css',
            'tmp/linksf_admin.js',
            'tmp/linksf_admin.css'
          ],
        },
        options: {
          complete: function(hashes) {
            // ugly but the only way to tag each file with a key
            var keyMap = {
                'tmp/linksf.js': 'linksf_js',
                'tmp/linksf.css': 'linksf_css',
                'tmp/linksf_admin.js': 'linksf_admin_js',
                'tmp/linksf_admin.css': 'linksf_admin_css'
               },
               context = {},
               Handlebars = require('handlebars'),
               template,
               output;

            // read parse secrets from .env
            require('fs').readFileSync('./.env')
              .toString()
              .split('\n')
              .forEach(function(line) {
                var segments = line.split('='),
                    variable = segments[0],
                    value = segments[1];

                if ( variable && value ) {
                  process.env[variable] = value;
                }
              });

            context.parseAppKey = process.env.PARSE_APP_KEY;
            context.parseJSKey  = process.env.PARSE_JS_KEY;

            // extract into separate grunt check task
            if ( !context.parseAppKey || !context.parseJSKey ) {
              console.log('Need PARSE_APP_KEY and PARSE_JS_KEY in your environment.')
              process.exit();
            }
            //

            Object.keys(hashes).forEach(function(key) {
              var matches = key.match(/^tmp\/(.*)(\..*)$/),
                  filename = matches[1],
                  extension = matches[2],
                  outputFile = 'build/' + filename + '-' + hashes[key] + extension;

              grunt.file.copy(key, outputFile);
              context[keyMap[key]] = outputFile;
            });

            template = Handlebars.compile(grunt.file.read('app/index.html'));
            output = template(context);
            grunt.file.write('index.html', output);

            template = Handlebars.compile(grunt.file.read('admin/admin.html'));
            output = template(context);
            grunt.file.write('admin.html', output);
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
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build:development', [
    'clean',
    'jshint',
    'simplemocha',
    'sass',
    'browserify',
    'concat:app',
    'concat:admin',
    'cachebuster'
  ]);

  grunt.registerTask('build:production', [
    'clean',
    'jshint',
    'simplemocha',
    'sass',
    'cssmin',
    'browserify',
    'uglify',
    'concat:app_min',
    'concat:admin_min',
    'cachebuster'
  ]);

  grunt.registerTask('default', [
    'build:development'
  ]);

  grunt.registerTask('release', [
    'build:production'
  ]);
};
