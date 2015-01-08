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
          config: true,
          ga: true,
          test: true,
          ok: true,
          equal: true,
          deepEqual: true
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
        reporter: 'dot'
      },

      all: {src: 'test/unit/**/*.js'}
    },

    watch: {
      files: [
        'Gruntfile.js',
        'app/**/*',
        'admin/**/*',
        'shared/**/*',
        'server/**/*',
        'vendor/**/*',
        '!vendor/**/*.min.*',
        'test/**/*'
      ],
      tasks: ['default']
    },

    sass: {
      options: {includePaths: ['.']},
      app: {src: 'app/css/app.scss', dest: 'tmp/linksf.css'},
      admin: {src: 'admin/css/admin.scss', dest: 'tmp/linksf_admin.css'}
    },

    browserify: {
      options: {transform: ['hbsfy']},
      app: {src: 'app/js/app.js', dest: 'tmp/app.js',
        options: {alias: [
          './shared/js/models/facility:cloud/models/facility',
          './shared/js/models/service:cloud/models/service',
          './shared/js/models/hours:cloud/models/hours',
          './shared/js/lib/categories:cloud/lib/categories'
        ]}
      },
      admin: {src: 'admin/js/admin.js', dest: 'tmp/admin.js',
        options: {alias: [
          './shared/js/models/facility:cloud/models/facility',
          './shared/js/models/service:cloud/models/service',
          './shared/js/models/hours:cloud/models/hours',
          './shared/js/lib/categories:cloud/lib/categories'
        ]}
      }
    },

    cssmin: {
      app: {src: 'tmp/linksf.css', dest: 'tmp/linksf.css'},
      admin: {src: 'tmp/linksf_admin.css', dest: 'tmp/linksf_admin.css'}
    },

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

      app: {
        src: [
          '<%= concat.shared_js %>',
          'vendor/js/backbone_filters.js',
          'vendor/js/jquery.switch.js',
          'vendor/js/bootstrap-button.js',
          'vendor/js/fastclick.js',
          'tmp/app.js'
        ],
        dest: 'tmp/linksf.js'
      },

      app_min: {
        src: [
          '<%= concat.shared_js_minified %>',
          'vendor/js/backbone_filters.min.js',
          'vendor/js/jquery.switch.min.js',
          'vendor/js/bootstrap-button.min.js',
          'vendor/js/fastclick.min.js',
          'tmp/app.min.js'
        ],
        dest: 'tmp/linksf.js'
      },

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
          'vendor/js/jquery.serialize-object.min.js': 'vendor/js/jquery.serialize-object.js',
          'vendor/js/backbone_filters.min.js': 'vendor/js/backbone_filters.js',
          'vendor/js/bootstrap-button.min.js': 'vendor/js/bootstrap-button.js'
        }
      },
      app: {files: {'tmp/app.min.js': 'tmp/app.js'}},
      admin: {files: {'tmp/admin.min.js': 'tmp/admin.js'}}
    },

    clean: {
      build: {src: 'build/*', filter: function(filepath) {return filepath !== 'build/.gitkeep';}},
      tmp: {src: 'tmp/*', filter: function(filepath) {return filepath !== 'tmp/.gitkeep'; }},
      test: {src: 'test/acceptance/app.html'}
    },

    cachebuster: {
      all: {
        files: {src: [
          'tmp/linksf.js',
          'tmp/linksf.css',
          'tmp/linksf_admin.js',
          'tmp/linksf_admin.css'
        ]},
        options: {
          complete: function(hashes) {
            var keyMap = {
              'tmp/linksf.js':        'appJs',
              'tmp/linksf.css':       'appCss',
              'tmp/linksf_admin.js':  'adminJs',
              'tmp/linksf_admin.css': 'adminCss'
            };

            var config = {
              parseAppId: process.env.PARSE_APP_ID,
              parseJsKey: process.env.PARSE_JS_KEY,
              gaToken:    process.env.GOOGLE_ANALYTICS_TOKEN,
              gaHost:     process.env.GOOGLE_ANALYTICS_HOST
            };

            Object.keys(hashes).forEach(function(key) {
              var matches = key.match(/^tmp\/(.*)(\..*)$/); // tmp/(filename)(.js)
              var outputFile = matches[1] + '-' + hashes[key] + matches[2];

              grunt.file.copy(key, 'build/' + outputFile);
              config[keyMap[key]] = outputFile;
            });

            grunt.file.write('build/index.html',
              grunt.template.process(grunt.file.read('app/index.html'), {data: config})
            );

            grunt.file.write('build/admin.html',
              grunt.template.process(grunt.file.read('admin/index.html'), {data: config})
            );

            grunt.file.write('test/acceptance/app.html',
              grunt.template.process(grunt.file.read('test/acceptance/app.html.template'), {data: config})
            );
          }
        }
      }
    },

    qunit: {all: ['test/acceptance/**/*.html']},

    env: {
      dev: {src: '.env.dev'},
      prod: {src: '.env.prod'}
    },

    autoprefixer: {
      options: {
        browsers: [
          'android >= 2.3',
          'last 3 versions'
        ]
      },
      all: {
        src: ['tmp/linksf.css', 'tmp/linksf_admin.css']
      }
    },

    s3: grunt.file.exists('s3.json') && grunt.file.readJSON('s3.json') || {},
    aws_s3: {
      options: {
        accessKeyId: '<%= s3.accessKeyId %>',
        secretAccessKey: '<%= s3.secretAccessKey %>',
        region: '<%= s3.region %>',
        uploadConcurrency: 4
      },
      dev: {
        options: { bucket: '<%= s3.devBucket %>' },
        files: [
          {expand: true, src: ['vendor/font/**', 'img/**']},
          {expand: true, cwd: 'build', src: '*', dest: '' }
        ]
      },
      prod: {
        options: { bucket: '<%= s3.prodBucket %>' },
        files: [
          {expand: true, src: ['vendor/font/**', 'img/**']},
          {expand: true, cwd: 'build', src: '*', dest: ''}
        ]
      }
    },

    shell: {
      parse: {
        command: 'parse deploy',
        options: {
          execOptions: {
            cwd: 'server'
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-cachebuster');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadTasks('tasks');

  grunt.registerTask('build:common', [
    'clean',
    'jshint',
    'simplemocha',
    'sass',
    'autoprefixer',
    'browserify'
  ]);

  grunt.registerTask('build:dev', [
    'env:dev',
    'build:common',
    'concat:app', 'concat:admin',
    'cachebuster',
    'qunit'
  ]);

  grunt.registerTask('build:prod', [
    'env:prod',
    'build:common',
    'cssmin', 'uglify',
    'concat:app_min', 'concat:admin_min',
    'cachebuster',
    'qunit'
  ]);

  grunt.registerTask('parse:deploy', ['parse:config', 'shell:parse']);
  grunt.registerTask('parse:deploy:dev', ['env:dev', 'parse:deploy']);
  grunt.registerTask('parse:deploy:prod', ['env:prod', 'parse:deploy']);

  grunt.registerTask('default', 'build:dev');

  grunt.registerTask('deploy:dev', [
    'build:dev',
    'aws_s3:dev',
    'parse:deploy:dev',
    'clean'
  ]);

  grunt.registerTask('deploy:prod', [
    'build:prod',
    'aws_s3:prod',
    'parse:deploy:prod',
    'clean'
  ]);
};
