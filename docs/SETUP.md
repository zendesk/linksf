# Setup

This guide explains how to install and setup Link-SF .

## Prerequisites

### Accounts

Link-SF is designed to be free to setup and free to run in perpetuity. Since hosting files is cheap, we've decided to go with building a [static site](https://en.wikipedia.org/wiki/Static_web_page). There's only one hard dependency as far as accounts go. Parse gives us data persistence, authentication for admins, and querying:

* [Parse](https://parse.com/#signup)

If you want to deploy the site publicly, S3 gives us free file hosting:

* [Amazon Web Services](http://aws.amazon.com/s3/?nc1=h_l2_sc)

The following accounts are optional:

* [Mailgun](http://www.mailgun.com/): For capturing feedback entered in the feedback form as an email to your account.
* [Google Analytics](http://www.google.com/analytics/): In addition to capturing useful things like user agent and traffic, we've added a couple custom events that help us keep track of how often a user connects to a service via external link (calling, visiting website, or getting directions).

### Command line tools

To build the site (turn a file tree into a monolithic html, js, and css file), you'll need some command line tools installed.

#### [Homebrew](http://brew.sh/)

    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

#### [Node](http://nodejs.org/) 0.12

    brew install node012

#### [Grunt](http://gruntjs.com/)

    npm install -g grunt-cli

#### [Parse CLI](https://www.parse.com/docs/cloudcode/guide)

    curl -s https://www.parse.com/downloads/cloud_code/installer.sh | /bin/bash

## Development

Download the source (via [git](git@github.com:zendesk/linksf.git) or [.zip file](https://github.com/zendesk/linksf/archive/master.zip)).

### Secrets

In the project root, you'll find a `.env.example` file. Make copies of that file called `.env.dev` and `.env.prod` in the same directory. They will probably look something like this:

```
PARSE_APP_NAME=xxxxxxx
PARSE_APP_ID=xxxxxxx
PARSE_JS_KEY=xxxxxxx
PARSE_MASTER_KEY=xxxxxxx
...
```

There are placeholders for development and production Parse tokens because we don't want any breakage during development to affect the production site. Create a [new Parse app](https://parse.com/apps/new) and call it whatever you'd like. Replace the token placeholder values (`xxxx`) with those specific to your apps from [Parse](https://parse.com/account/keys). The Mailgun and Google Analytics tokens can be ignored for now, if you'd like.

Keep your `.env.dev` and `.env.prod` files secret (out of source control, etc).

### Building the site

From the project root (and with the command line tools outlined above installed):

1. `./bin/setup`
1. `grunt parse:deploy:dev`
1. `open build/index.html`

If everything worked, you should have Link-SF open and running in your browser. You won't see any facilities listed in search, so you'll want to add one in the admin interface. First, create a new user in the Parse interface, then:

1. `open build/admin.html`

Login using the credentials for the user you just added, then add a facility and service. From the Parse website, go to the Data Browser and set the permissions on the Facility and Service objects to have public GET and FIND permissions. You will be able to return to the enduser app and see the facility in search results.

### Making changes to the site

Making changes to the site is pretty simple. `grunt` will build the site once, then you want to invoke `grunt watch` which will rebuild the site once the watched set of files change. The flow should be:

1. `grunt`
1. `grunt watch`
1. edit a watched file, then save
1. see the site rebuild in your terminal
1. reload the page and see updated build

#### Updating fonts

We use http://fontello.com to generate an icon bundle. [Here's a guide on how to add or change icons](https://github.com/zendesk/linksf/blob/master/docs/ICONS.md).

### Testing

To test out the app, using an emulator is best in the absence of an actual device; this lets us simulate our target devices fairly well. Our target device is any 320x480 phone on Android 2.2.

To get an android emulator setup on Mac OS:

1. Download the [Android Developer Tools](https://developer.android.com/sdk/index.html#download)
1. Open the `adt-bundle-mac-...` folder, and open `Eclipse.app`. You may have to control-click and select `Open`, since this is a `.app` directly downloaded from an untrusted source.
1. Window -> Android SDK Manager
1. In the list of packages, select `Android 2.2 (API 8)` and click `Install packages...`.
1. Window -> Android Virtual Device Manager
1. Click `New...` and configure a new device with 320x480 resolution and targeting Android 2.2.
1. Click `Start...`
1. Open the Android browser and visit Link-SF.

### Feedback form

If you'd like to use a feedback form:

1. Setup a [Mailgun](http://www.mailgun.com/) account
2. Add your Mailgun domain and API key to the `.env.xxx` files (see [example .env.xxx file](https://github.com/zendesk/linksf/blob/master/.env.example))
3. Addany to/from email address you'd like to the `.env.xxx` files on the `MAILGUN_TO_EMAIL_ADDRESS` and `MAILGUN_FROM_EMAIL_ADDRESS` lines.
4. Deploy your new changes, then check to see if your feedback form works as intended (you'll find the feedback link on the footer of the home and detail pages).
