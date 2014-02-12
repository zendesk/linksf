## Raison d'être

The Tenderloin tech lab has seen that while a lot of people in the Mid-Market area do not have access to computers, they do have relatively affordable access to mobile phones.

The platform has two goals:

1. Provide a city-wide consolidated database for storing and updating information about public services. Currently this information is very difficult to find and keep up-to-date.
1. Provide a mobile site that allows individuals to access and search for this information easily.

For example, if I'm a woman with two children and need temporary housing, I would want to be able to find the nearest women/children-only shelter that's open right now.

This is part of our Community Benefit Agreement with the city.

From Steven:
> On the surface, this seems like a straightforward database design exercise with a query interface, right? In the back of my mind, I think there's larger benefits here in understanding interest patterns in the demographic of the Mid-Market. What could you do as a city leader if you knew in real-time:
>
>- What resources people are searching for
>- Where they are searching from
>- What they ended up choosing

This will replace http://ttlsf.herokuapp.com/ which uses a [Google spreadsheet](https://docs.google.com/spreadsheet/ccc?key=0AkkJeKqc-HDpdE5INXRRYVdMVmd5ay15dm5LZEdPLWc#gid=0) for persistence.

## Link-SF

Link-SF is a Backbone.js application using Parse for our persistence and querying backend.

The current release is deployed to http://link-sf.com.

The original mockup is at http://f.cl.ly/items/2q1D093m3R3W2C3s3M40/TTL%20Mobile%20Resource.pdf.

### Setup

```
npm install
npm install -g grunt-cli
```

### Development

There is a `Gruntfile` that describes the available tasks.

`grunt` invokes verification and compilation. Output goes to static files that are included in build/index.html and build/admin.html.

`grunt watch` invokes verification and compilation when JavaScript, HTML, SCSS, and Handlebars file changes are detected.

Subtle, but you'll need to first run `grunt` for the first-time compilation before beginning work or after pulling the latest changes, then `grunt watch` to have recompilation happen as you edit files. Compilation will produce the app html at `build/index.html` and the admin site at `build/admin.html`. These files can be opened from the command line with `open build/index.html` or directly from a browser.

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

We're currently testing versions of Windows Phone.
