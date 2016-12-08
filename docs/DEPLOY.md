# Deploying Link-SF

Link-SF has two major pieces, a firebase.com database and a static HTML/js/css app.  Both components are hosted and served by Firebase.  The database portion can be populated in a variety of ways, but this section will only cover deploying the static application.  For instructions on preparing your database, please see [Setup](https://github.com/zendesk/linksf/blob/master/docs/SETUP.md).

### How to do it

Again, first make sure you have completed all of the steps in [Setup](https://github.com/zendesk/linksf/blob/master/docs/SETUP.md). Setup covers required tools as well as logging into your Firebase account.  

If you're deploying from a Unix system with Bash, you can use the pre-written deploy script.

`./script/deploy`

## Building your website

To build and pack your website into a singular, deployable bundle, we are using node.

`node run build --release`

## Deploying your Link-SF instance

Deploying is made simple with the Firebase CLI tools.

`firebase deploy`

If no errors appeared, your website should be live at the Hosting URL.  You can double check everything worked from the Hosting tab in your [Firebase Console](https://firebase.google.com/console).

## Connecting your custom domain

If you have a custom domain you want to host your Link-SF instance under, visit the Hosting tab in your [Firebase Console](https://firebase.google.com/console), click the button reading "CONNECT CUSTOM DOMAIN", and follow through the prompts to verify ownership.
