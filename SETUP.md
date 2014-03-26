# Setup

This guide explains how to install and setup the Link-SF application.

## Prerequisites

### Accounts

Link-SF is designed to be free to setup and free to run in perpetuity. Since hosting files is cheap, we've decided to go with building a static site. There's only one hard dependency as far as accounts go. Parse gives us data persistence, authentication for admins, and querying:

* [Parse](https://parse.com/#signup)

If you want to deploy the site publicly, S3 gives us free file hosting:

* [Amazon Web Services](http://aws.amazon.com/s3/?nc1=h_l2_sc)

The following accounts are optional:

* [Mailgun](http://www.mailgun.com/): For capturing feedback entered in the feedback form as an email to your account.
* [Google Analytics](http://www.google.com/analytics/): In addition to capturing useful things like user agent and traffic, we've added a couple custom events that help us keep track of how often a user connects to a service via external link (calling, visiting website, or getting directions).

Once you have the accounts necessary, we can look at running the site locally.

### Development

Download the source (via [git](git@github.com:zendesk/linksf.git) or [.zip file](https://github.com/zendesk/linksf/archive/master.zip)).

#### Secrets

In the project root, you'll find a `.env.example` file. Make a copy of that file called `.env` in the same directory. It will probably look like this:

```
PARSE_DEV_APP_ID=xxxxxxx
PARSE_DEV_JS_KEY=xxxxxxx
PARSE_DEV_MASTER_KEY=xxxxxxx
PARSE_PROD_APP_ID=xxxxxxx
PARSE_PROD_JS_KEY=xxxxxxx
PARSE_PROD_MASTER_KEY=xxxxxxx
...
```

There are placeholders for development and production Parse tokens because we don't want any breakage during development to affect the production site. Create a [new Parse app](https://parse.com/apps/new) and call it whatever you'd like. Replace the token placeholder values (`xxxx`) with those specific to your apps from [Parse](https://parse.com/account/keys). The Mailgun and Google Analytics tokens can be ignored for now, if you'd like.

Keep your `.env` file secret (out of source control, etc).

#### Building the site

#### Making changes to the site

Download

The development toolkit uses
* ruby
* node
* npm
* s3cmd
* parse

### Deployment
