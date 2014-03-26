## Link-SF

http://link-sf.com

A mobile website designed to connect those in need in San Francisco to the services that can help them, on their own terms.

### Architecture

Link-SF is a static single page Backbone.js application using [Parse](https://parse.com/) for our persistence and querying backend.

There are three core views:

* Home
  A button for each category that goes to the list view with a preconfigured query. The only constraint for these queries is the button's service category.
* List
  A list of services that match the current query. Each list item may be tapped to drill down into the detail view. The sorting toggles and 'more options' can be used to further filter the search.
* Detail
  Information for the facility selected, external links (call/directions/website), details on services offered.

### Setup

```
npm install
npm install -g grunt-cli
```

### Development

There is a `Gruntfile` that describes the available tasks.

`grunt` invokes verification and compilation. Output goes to static files that are included in build/index.html and build/admin.html.

`grunt watch` invokes verification and compilation when JavaScript, HTML, SCSS, and Handlebars file changes are detected.

You'll need to first run `grunt` for the first-time compilation before beginning work or after pulling the latest changes, then `grunt watch` to have recompilation happen as you edit and save files. Compilation will produce the app html at `/index.html` and the admin site at `/admin.html`. These files can be opened from the command line with `open index.html` or directly from a browser.

### Deploy

`rake deploy:development` and `rake deploy:production` will generate static assets then use the `s3cmd` CLI tool to upload them to AWS and `parse` to upload cloud functions to parse.com. You'll need `s3cmd` and `parse` CLI tools:

* Install `s3cmd`: `brew install s3cmd`
* Install `parse`: `curl -s https://www.parse.com/downloads/cloud_code/installer.sh | sudo /bin/bash` (https://parse.com/docs/cloud_code_guide)

The latest production deploy is reachable at http://link-sf.com. We should only deploy production when we are confident that the currently checked out code is usable. The latest development deploy should be available at http://dev.link-sf.com. Feel free to deploy any code here for testing, if desired.

### Build process

Developing in a pure concatenation-based (or single-file) app is chaos. To alleviate this pain, we use a CommonJS module system. Typically CommonJS modules are used on the server, but we use Browserify to generate the module registry and provide a `require` implementation on the client.

Generally, the build steps are:

1. empty `build` and `tmp` directories
  `build` is used to store built files, and `tmp` holds build artifacts (unconcatenated processed files)
1. `jshint` JavaScript
1. run tests
1. compile scss files and produce app and admin css files
1. browserify
1. concatenate vendor and application JavaScript
1. add MD5 hashes to filenames for cache busting

### Icons

We use http://fontello.com to generate an icon bundle.  Here's how to add or change:

1. go to fontello.com
1. upload the current bundle in vendor/ using their "import" feature
1. clicky clicky and change things
1. re-download the bundle.  make sure the name is "icons"
1. unzip the bundle and copy font/* as well as css/icons.css into place
1. correct the paths in css/icons.css
1. replace the zip file with the curent one

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

### Mobile support

We currently support:

* Android 2.2+
* IE10+ on desktop
* iOS 7+
* Recent Chrome, Safari, Firefox on desktop
* Windows Phone 7.8+
