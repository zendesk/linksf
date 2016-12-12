# Setup

This guide explains how to install and setup your Link-SF.

## Prerequisites

### Accounts

Link-SF is designed to be free to setup and free to run. Since hosting files is cheap, we've decided to build a [static site](https://en.wikipedia.org/wiki/Static_web_page).

* [Firebase](https://firebase.google.com/console):  Firebase is the only required account, and it's completely free.  It will provide everything we need to get up and running, including database storage, authentication, and hosting.

  **Note**  Every administrator on your account will need to be created under the Authentication panel in your new Firebase Console.  You won't be able to adjust your production data from the app without it!

The following accounts are optional:

* [Google Analytics](http://www.google.com/analytics/):  Google Analytics captures useful events like user agent information and traffic data.

### Get the code

Download the source (via [git](git@github.com:zendesk/linksf.git) or [.zip file](https://github.com/zendesk/linksf/archive/master.zip)).

## Setup

### Database Population

If you have an existing project hosted with Parse, you can use our migration tool to copy all of your data into  Firebase.

 * [Link Migrator](http://linkmigrator.herokuapp.com/)

To see more about how your data is structured and what it means, read our [Management documentation](https://github.com/zendesk/linksf/blob/master/docs/MANAGE.md)

### Configuration

In the project root, you will find three configuration files:

1. `.firebaserc`

  In `.firebaserc`, you will need to replace all instances of `[PROJECT_ID]` with your own Project ID, which can be found in your [Firebase Console](https://firebase.google.com/console) general settings.  This file contains aliases for various deploy destinations.  For example, if you wanted to have a testing environment and a production environment, you could set the two different Firebase Project IDs here.

2. `config.js`

  `config.js` contains a variety of details and keys.  Here's what you need to do:
  * Customize your project's title and description.
  * Like in `.firebaserc`, replace all locations of `[PROJECT_ID]` with your own Project ID.
  * Fill in your Firebase API Key in the `[FIREBASE_API_KEY]` slot, which can be found on the same page as your Project ID.
  * Enter the email address you'd like to receive feedback at (for more information see the Feedback form section below).

3. `run.js`

  Near the top, there will be a configuration section that looks like this:

  ```
  const config = {
    title: 'Link-SF',           // Your website title
    url: 'https://link-sf.com', // Your website URL
    project: 'link-sf',         // Firebase project. See README.md -> How to Deploy
    trackingID: 'UA-XXXXX-Y',   // Google Analytics Site's ID
  };
  ```

  Just fill in the information, it should be pretty self-explanatory!  Please note if you are using Google Analytics (optional), this is where you will insert your tracking ID.


### Install tools

If you are working from a Unix system with Bash, you can use the pre-written boostrap script, which will complete all remaining steps in this doc.

`./script/bootstrap`

Otherwise follow the steps below for your system.

1. Install the current node version

  If you are using a version manager such as nvm, run `nvm install`, otherwise download and install the current version from `.nvmrc` from [the node website](http://nodejs.org/).

2. Install our package manager (npm)

  Follow the installation instructions from [the npm repository](https://github.com/npm/npm).

3. Install Firebase Tools

  Follow the installation instructions from the [Firebase Tools repository](https://github.com/firebase/firebase-tools).

### Install dependencies

Using npm, we can install all dependencies with one command.

`npm install`

### Setting up your Firebase project

The following steps will use Firebase Tools to authenticate and set up your local Link-SF copy in preparation to deploy.

1. Login

  Just use your Google credentials and go with the flow.

  `firebase login`

2. Add your Firebase project

  This will configure which project we deploy to. Choose the correct one at the prompt and give it a nickname.

  `firebase use --add`

## Running the site locally

From the project root (and with the command line tools outlined above installed):

`npm start`

If everything worked, you should have Link-SF open and running in your browser. If you migrated data from Parse, you should see everything show up here.  If not, you will need to add data using the administrator interface by visiting `/admin`.

### Making changes to the site

Making changes to the site is pretty simple. `webpack` will build the site and watch for changes. Most the time you should not even have to refresh your browser to see a change! (That's called "hot reloading").

#### Updating icons

We use http://fontello.com to generate an icon bundle. [Here's a guide on how to add or change icons](https://github.com/zendesk/linksf/blob/master/docs/ICONS.md).

### Feedback form

Link-SF uses [Formspree](https://formspree.io/) to send emails from the static site.

If you'd like to use a feedback form:

1. Add the email address where you would like feedback form submissions to be sent to in `config.js` under `[FEEDBACK_EMAIL_ADDRESS]`.
2. Deploy your new changes and navigate to the feedback page (you'll find the feedback link on the footer of the home and detail pages).
3. On the feedback page, make sure to submit the form once. This will send an email asking you to confirm your email address. Confirm your email address and submit the form once more to make sure everything is working smoothly. You're all set!
