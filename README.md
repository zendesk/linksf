The Tenderloin tech lab has seen that while a lot of people in the Mid-Market area do not have access to computers, they do have relatively affordable access to mobile phones.

The platform has two goals:

1. Provide a city-wide consolidated database for storing and updating information about public services. Currently this information is very difficult to find and keep up-to-date.
1. Provide a mobile site that allows individuals to access and search for this information easily.

For example, if I'm a woman with two children and need temporary housing, I would want to be able to find the nearest women/children-only shelter that's open right now.

This is part of our Community Benefit Agreement with the city. Steven told Tiffany we would shoot to get a first version done by end of April.

From Steven:
> On the surface, this seems like a straightforward database design exercise with a query interface, right? In the back of my mind, I think there's larger benefits here in understanding interest patterns in the demographic of the Mid-Market. What could you do as a city leader if you knew in real-time:
>
>- What resources people are searching for
>- Where they are searching from
>- What they ended up choosing

This will replace http://ttlsf.herokuapp.com/ which uses a [Google spreadsheet](https://docs.google.com/spreadsheet/ccc?key=0AkkJeKqc-HDpdE5INXRRYVdMVmd5ay15dm5LZEdPLWc#gid=0) for persistence.

## Link SF

We're going to have three main components: database/query api, frontend, and admin ui.

* database/query api: [Parse](https://parse.com/)
* frontend: Backbone.js with jQuery, [mockup](http://f.cl.ly/items/2q1D093m3R3W2C3s3M40/TTL%20Mobile%20Resource.pdf)
* admin ui: ???

### fixture data

[here is fixture data.  here.](https://docs.google.com/spreadsheet/ccc?key=0AoYMeoUU9D_sdGpZaklYd2VtdVNhWXRNLWhMV2Uwa2c#gid=0)

####JS workflow

We want to write JS like civilized folk.

Setup:

```
npm install
npm install -g grunt-cli
```

Development:

There is a `Gruntfile` that describe the available tasks.

```
grunt watch
```

Watches `app/**/*.js` and runs `jshint` and a `browserify` task. The output is a `js/static/output.js` file which is included in index.html.

You can also just run `grunt` to verify JS and generate the `static/output.js` file.

####a changelog of sorts

* Added load_fixtures.html and got some decently normalized data into parse.
* Added a scaffold [cloudcode](https://www.parse.com/docs/cloud_code_guide) app
* Added `Facility` and `Service` Backbone models
