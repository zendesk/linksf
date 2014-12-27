module.exports = function(grunt) {
  grunt.registerTask('tokens', 'Configure Parse and Mailgun tokens.', function() {
    [
      'PARSE_APP_NAME',
      'PARSE_APP_ID',
      'PARSE_MASTER_KEY'
    ].forEach(function(variable) {
      if ( !process.env[variable] ) {
        console.log(variable, 'is needed in ENV.');
        process.exit(1);
      }
    });

    grunt.file.write('server/config/global.json',
      grunt.template.process(grunt.file.read('server/config/global.json.template'), {data: {
        parseAppName:   process.env.PARSE_APP_NAME,
        parseAppId:     process.env.PARSE_APP_ID,
        parseMasterKey: process.env.PARSE_MASTER_KEY
      }})
    );

    grunt.file.write('server/cloud/cloud/mailgun_credentials.js',
      grunt.template.process(grunt.file.read('server/cloud/cloud/mailgun_credentials.js.template'), {data: {
        mailgunDomain:    process.env.MAILGUN_DOMAIN,
        mailgunApiKey:    process.env.MAILGUN_API_KEY,
        mailgunToEmail:   process.env.MAILGUN_TO_EMAIL_ADDRESS,
        mailgunFromEmail: process.env.MAILGUN_FROM_EMAIL_ADDRESS
      }})
    );
  });
};
