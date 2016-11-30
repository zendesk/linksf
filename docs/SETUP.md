# Setup

This guide explains how to install and setup Link-SF.

## Prerequisites

### Accounts

Link-SF is designed to be free to setup and free to run in perpetuity. Since hosting files is cheap, we've decided to go with building a [static site](https://en.wikipedia.org/wiki/Static_web_page). There's only one hard dependency as far as accounts go. Firebase gives us data persistence and authentication.

* [Firebase](https://firebase.google.com/console)

If you want to deploy the site publicly, S3 gives us free file hosting:

* [Amazon Web Services](http://aws.amazon.com/s3/?nc1=h_l2_sc)

The following accounts are optional:

* [Google Analytics](http://www.google.com/analytics/): In addition to capturing useful things like user agent and traffic, we've added a couple custom events that help us keep track of how often a user connects to a service via external link (calling, visiting website, or getting directions).

### Command line tools

To build the site (turn a file tree into a monolithic html, js, and css file), you'll need some command line tools installed from the sites below:

* [node](http://nodejs.org/)

## Development

Download the source (via [git](git@github.com:zendesk/linksf.git) or [.zip file](https://github.com/zendesk/linksf/archive/master.zip)).

### Secrets

In the project root, you'll find a `.env.example` file. Make copies of that file called `.env.dev` and `.env.prod` in the same directory. They will probably look something like this:

```
FEEDBACK_EMAIL_ADDRESS=xxxxxxx
...
```

Keep your `.env.dev` and `.env.prod` files secret (out of source control, etc).

### Building the site

From the project root (and with the command line tools outlined above installed):

1. `npm install`
2. `npm start`

If everything worked, you should have Link-SF open and running in your browser. You won't see any facilities listed in search, so you'll want to add one in the admin interface. First, create a new user in the Firebase interface.

**TODO** Explain what to do in Firebase

### Making changes to the site

Making changes to the site is pretty simple. `webpack` will build the site and watch for changes. Most the time you should not even have to refresh your browser to see a change! (That's called "hot reloading").

#### Updating fonts

We use http://fontello.com to generate an icon bundle. [Here's a guide on how to add or change icons](https://github.com/zendesk/linksf/blob/master/docs/ICONS.md).

### Testing

**TODO** Fill out when we have tests

### Feedback form

Link-SF uses [Formspree](https://formspree.io/) to send emails from the static site.

If you'd like to use a feedback form:

1. Add the email address where you would like feedback form submissions to be sent to the `.env.xxx` files on the `FEEDBACK_EMAIL_ADDRESS` line (see [example .env.xxx file](https://github.com/zendesk/linksf/blob/master/.env.example))
1. Deploy your new changes and navigate to the feedback page (you'll find the feedback link on the footer of the home and detail pages).
1. On the feedback page, make sure to submit the form once. This will send an email asking you to confirm your email address. Confirm your email address and submit the form once more to make sure everything is working smoothly. You're all set!
