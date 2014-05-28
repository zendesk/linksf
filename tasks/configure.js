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

function configure(grunt, templatePath, targetPath, data) {
  var template = grunt.file.read(templatePath),
      output = grunt.template.process(template, { data: data });

  if ( !grunt.file.exists(targetPath) || grunt.file.read(targetPath) !== output ) {
    grunt.file.write(targetPath, output);
    console.log('File "' + targetPath + '" created.');
  }
}

function configureAppTokens(grunt) {
  configure(grunt, 'app/index.html', 'tmp/index.html', {
    GOOGLE_ANALYTICS_TOKEN: process.env.GOOGLE_ANALYTICS_TOKEN,
    GOOGLE_ANALYTICS_HOST: process.env.GOOGLE_ANALYTICS_HOST,
    PARSE_APP_ID: process.env.PARSE_APP_ID,
    PARSE_JS_KEY: process.env.PARSE_JS_KEY
  });
}

function configureAdminTokens(grunt) {
  configure(grunt, 'admin/admin.html', 'tmp/admin.html', {
    PARSE_APP_ID: process.env.PARSE_APP_ID,
    PARSE_JS_KEY: process.env.PARSE_JS_KEY
  });
}

function configureMailgunTokens(grunt) {
  configure(grunt, 'server/cloud/cloud/mailgun_credentials.js.template', 'server/cloud/cloud/mailgun_credentials.js', {
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
    MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
    MAILGUN_TO_EMAIL_ADDRESS: process.env.MAILGUN_TO_EMAIL_ADDRESS,
    MAILGUN_FROM_EMAIL_ADDRESS: process.env.MAILGUN_FROM_EMAIL_ADDRESS,
  })
}

function configureGlobalJson(grunt) {
  configure(grunt, 'server/config/global.json.template', 'server/config/global.json', {
    PARSE_DEV_APP_ID:      process.env.PARSE_DEV_APP_ID,
    PARSE_DEV_MASTER_KEY:  process.env.PARSE_DEV_MASTER_KEY,
    PARSE_PROD_APP_ID:     process.env.PARSE_PROD_APP_ID,
    PARSE_PROD_MASTER_KEY: process.env.PARSE_PROD_MASTER_KEY
  });
}

module.exports = function(grunt) {
  grunt.registerTask('configure:development:app', 'Configure for the development app environment.', function() {
    loadEnv('.env');

    ensureInEnv([
      'MAILGUN_DOMAIN',
      'MAILGUN_API_KEY',
      'MAILGUN_TO_EMAIL_ADDRESS',
      'MAILGUN_FROM_EMAIL_ADDRESS',
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
    configureAppTokens(grunt);
    configureMailgunTokens(grunt);
  });

  grunt.registerTask('configure:development:admin', 'Configure for the development admin environment.', function() {
    loadEnv('.env');

    ensureInEnv([
      'PARSE_DEV_APP_ID',
      'PARSE_DEV_JS_KEY',
      'PARSE_DEV_MASTER_KEY'
    ]);

    process.env.PARSE_APP_ID = process.env.PARSE_DEV_APP_ID;
    process.env.PARSE_JS_KEY = process.env.PARSE_DEV_JS_KEY;

    configureGlobalJson(grunt);
    configureAdminTokens(grunt);
  });

  grunt.registerTask('configure:production', 'Configure for the production environment.', function() {
    loadEnv('.env');

    ensureInEnv([
      'MAILGUN_DOMAIN',
      'MAILGUN_API_KEY',
      'MAILGUN_TO_EMAIL_ADDRESS',
      'MAILGUN_FROM_EMAIL_ADDRESS',
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
    configureAppTokens(grunt);
    configureAdminTokens(grunt);
    configureMailgunTokens(grunt);
  });
};
