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

```
grunt # Needed after cloning the repo or if `grunt watch` wasn't running, to pick lastest code changes.
open build/index.html
grunt watch
```

### Deploy

`rake deploy` will generate static assets then use the `s3cmd` CLI tool to upload them to AWS.

The latest deploy should be available at http://link-sf.com.

### Build process

Developing in a pure concatenation-based (or single-file) app is chaos. To alleviate this pain, we use a CommonJS module system. Typically CommonJS modules are used on the server, but we use Browserify to generate the module registry and provide a `require` implementation on the client.

Generally, the build steps are:

1. empty `build` and `tmp` directories
1. `jshint` JavaScript
1. run tests
1. feed scss files into sass compiler, producing one css file for app, one for admin
1. browserify
1. concatenate vendor and application JavaScript
1. add MD5 hashes to filenames for cache busting

For releasing to production, the `release` task also minifies CSS and JavaScript. Details are available in the Gruntfile comments.

### Icons

We use http://fontello.com to generate an icon bundle.  Here's how to add or change:
- go to fontello.com
- upload the current bundle in vendor/ using their "import" feature
- clicky clicky and change things
- re-download the bundle.  make sure the name is "icons"
- unzip the bundle and copy font/* as well as css/icons.css into place
- correct the paths in css/icons.css
- replace the zip file with the curent one
