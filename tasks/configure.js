function loadEnv(envFile) {
  require('fs').readFileSync(envFile)
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
}

function ensureInEnv(variables) {
  variables.forEach(function(variable) {
    if ( !process.env[variable] ) {
      console.log(variable, 'is needed in .env.')
      process.exit(1);
    }
  });
}

function configure(grunt, targetPath, data) {
  var templatePath = targetPath + '.template',
      template = grunt.file.read(templatePath),
      output = grunt.template.process(template, data);

  if ( !grunt.file.exists(targetPath) || grunt.file.read(targetPath) !== output ) {
    grunt.file.write(targetPath, output);
  }
}

function configureGoogleAnalytics(grunt) {
  configure(grunt, 'app/index.html', {
    GOOGLE_ANALYTICS_TOKEN: process.env.GOOGLE_ANALYTICS_TOKEN,
    GOOGLE_ANALYTICS_HOST: process.env.GOOGLE_ANALYTICS_HOST
  });
}

function configureGlobalJson(grunt) {
  configure(grunt, 'server/config/global.json', {
    PARSE_DEV_APP_ID:      process.env.PARSE_DEV_APP_ID,
    PARSE_DEV_MASTER_KEY:  process.env.PARSE_DEV_MASTER_KEY,
    PARSE_PROD_APP_ID:     process.env.PARSE_PROD_APP_ID,
    PARSE_PROD_MASTER_KEY: process.env.PARSE_PROD_MASTER_KEY
  });
}

module.exports = function(grunt) {
  grunt.registerTask('configure:development', 'Configure for the development environment.', function() {
    loadEnv('.env');

    ensureInEnv([
      'PARSE_DEV_APP_ID',
      'PARSE_DEV_JS_KEY',
      'PARSE_DEV_MASTER_KEY',
      'GOOGLE_ANALYTICS_DEV_TOKEN',
      'GOOGLE_ANALYTICS_DEV_HOST'
    ]);

    process.env.PARSE_APP_ID = process.env.PARSE_DEV_APP_ID;
    process.env.PARSE_JS_KEY = process.env.PARSE_DEV_JS_KEY;
    process.env.GOOGLE_ANALYTICS_TOKEN = process.env.GOOGLE_ANALYTICS_DEV_TOKEN;
    process.env.GOOGLE_ANALYTICS_HOST = process.env.GOOGLE_ANALYTICS_DEV_HOST;

    configureGlobalJson(grunt);
    configureGoogleAnalytics(grunt);
  });

  grunt.registerTask('configure:production', 'Configure for the production environment.', function() {
    loadEnv('.env');

    ensureInEnv([
      'PARSE_PROD_APP_ID',
      'PARSE_PROD_JS_KEY',
      'PARSE_PROD_MASTER_KEY',
      'GOOGLE_ANALYTICS_PROD_TOKEN',
      'GOOGLE_ANALYTICS_PROD_HOST'
    ]);

    process.env.PARSE_APP_ID = process.env.PARSE_PROD_APP_ID;
    process.env.PARSE_JS_KEY = process.env.PARSE_PROD_JS_KEY;
    process.env.GOOGLE_ANALYTICS_TOKEN = process.env.GOOGLE_ANALYTICS_PROD_TOKEN;
    process.env.GOOGLE_ANALYTICS_HOST = process.env.GOOGLE_ANALYTICS_PROD_HOST;

    configureGlobalJson(grunt);
    configureGoogleAnalytics(grunt);
  });
};
