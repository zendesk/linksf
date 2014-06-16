function loadEnv(grunt, envFile) {
  var exists = grunt.file.exists;
  var read   = grunt.file.read;

  if ( !exists(envFile) ) {
    console.log(envFile + ' not found; assuming ENV variables are already present.');
    return;
  }

  read(envFile)
    .toString()
    .split('\n')
    .forEach(function(line) {
      var segments = line.split('=');
      var variable = segments[0];
      var value    = segments[1];

      if ( variable && value ) {
        process.env[variable] = value;
      }
    });
}

function ensureInEnv(variables) {
  variables.forEach(function(variable) {
    if ( !process.env[variable] ) {
      console.log(variable, 'is needed in .env or ENV.')
      process.exit(1);
    }
  });
}

function configure(grunt, source, destination, context) {
  var read    = grunt.file.read;
  var write   = grunt.file.write;
  var exists  = grunt.file.exists;
  var process = grunt.template.process;

  var output = process(read(source), { data: context });

  if ( !exists(destination) || read(destination) !== output ) {
    write(destination, output);
  }
}

function configureApp(grunt) {
  configure(grunt,
    'app/index.html',
    'tmp/index.html',
    {
      GOOGLE_ANALYTICS_TOKEN: process.env.GOOGLE_ANALYTICS_TOKEN,
      GOOGLE_ANALYTICS_HOST:  process.env.GOOGLE_ANALYTICS_HOST,
      PARSE_APP_ID:           process.env.PARSE_APP_ID,
      PARSE_JS_KEY:           process.env.PARSE_JS_KEY
    }
  );
}

function configureAdmin(grunt) {
  configure(grunt,
    'admin/admin.html',
    'tmp/admin.html',
    {
      PARSE_APP_ID: process.env.PARSE_APP_ID,
      PARSE_JS_KEY: process.env.PARSE_JS_KEY
    }
  );
}

function configureMailgun(grunt) {
  configure(grunt,
    'server/cloud/cloud/mailgun_credentials.js.template',
    'server/cloud/cloud/mailgun_credentials.js',
    {
      MAILGUN_DOMAIN:             process.env.MAILGUN_DOMAIN,
      MAILGUN_API_KEY:            process.env.MAILGUN_API_KEY,
      MAILGUN_TO_EMAIL_ADDRESS:   process.env.MAILGUN_TO_EMAIL_ADDRESS,
      MAILGUN_FROM_EMAIL_ADDRESS: process.env.MAILGUN_FROM_EMAIL_ADDRESS,
    }
  )
}

function configureParse(grunt) {
  configure(grunt,
    'server/config/global.json.template',
    'server/config/global.json',
    {
      PARSE_DEV_APP_ID:      process.env.PARSE_DEV_APP_ID,
      PARSE_DEV_MASTER_KEY:  process.env.PARSE_DEV_MASTER_KEY,
      PARSE_PROD_APP_ID:     process.env.PARSE_PROD_APP_ID,
      PARSE_PROD_MASTER_KEY: process.env.PARSE_PROD_MASTER_KEY
    }
  );
}

module.exports = function(grunt) {
  grunt.registerTask('configure:development:app',
    'Configure for the development app environment.',
    function() {
      loadEnv(grunt, '.env');

      ensureInEnv([
        'PARSE_DEV_APP_ID',
        'PARSE_DEV_JS_KEY',
        'PARSE_DEV_MASTER_KEY'
      ]);

      process.env.PARSE_APP_ID           = process.env.PARSE_DEV_APP_ID;
      process.env.PARSE_JS_KEY           = process.env.PARSE_DEV_JS_KEY;
      process.env.GOOGLE_ANALYTICS_TOKEN = process.env.GOOGLE_ANALYTICS_DEV_TOKEN;
      process.env.GOOGLE_ANALYTICS_HOST  = process.env.GOOGLE_ANALYTICS_DEV_HOST;

      configureParse(grunt);
      configureApp(grunt);
      configureMailgun(grunt);
    }
  );

  grunt.registerTask('configure:development:admin', 'Configure for the development admin environment.', function() {
    loadEnv(grunt, '.env');

    ensureInEnv([
      'PARSE_DEV_APP_ID',
      'PARSE_DEV_JS_KEY',
      'PARSE_DEV_MASTER_KEY'
    ]);

    process.env.PARSE_APP_ID = process.env.PARSE_DEV_APP_ID;
    process.env.PARSE_JS_KEY = process.env.PARSE_DEV_JS_KEY;

    configureParse(grunt);
    configureAdmin(grunt);
  });

  grunt.registerTask('configure:production', 'Configure for the production environment.', function() {
    loadEnv(grunt, '.env');

    ensureInEnv([
      'PARSE_PROD_APP_ID',
      'PARSE_PROD_JS_KEY',
      'PARSE_PROD_MASTER_KEY'
    ]);

    process.env.PARSE_APP_ID           = process.env.PARSE_PROD_APP_ID;
    process.env.PARSE_JS_KEY           = process.env.PARSE_PROD_JS_KEY;
    process.env.GOOGLE_ANALYTICS_TOKEN = process.env.GOOGLE_ANALYTICS_PROD_TOKEN;
    process.env.GOOGLE_ANALYTICS_HOST  = process.env.GOOGLE_ANALYTICS_PROD_HOST;

    configureParse(grunt);
    configureApp(grunt);
    configureAdmin(grunt);
    configureMailgun(grunt);
  });
};
