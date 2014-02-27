var mailgunCredentials = require('cloud/cloud/mailgun_credentials');
var Mailgun = require('mailgun');

module.exports = function (params, response) {
  Mailgun.initialize(mailgunCredentials.domain, mailgunCredentials.apiKey);

  if ( !params.from_email || !params.from_name || !params.subject || !params.body ) {
    response.error("Please fill everything out");
  }

  var body = "Feedback from: " + params.from_name + " <" + params.from_email + ">" + "\n\n" + params.body;

  Mailgun.sendEmail({
    to: mailgunCredentials.toEmailAddress,
    from: mailgunCredentials.fromEmailAddress,
    subject: "[feedback]: " + params.subject,
    text: body
  }, {
    success: function(httpResponse) {
      console.log(httpResponse);
      response.success("Email sent!");
    },
    error: function(httpResponse) {
      console.error(httpResponse);
      response.error("Uh oh, something went wrong");
    }
  });
};

