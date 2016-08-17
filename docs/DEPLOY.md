# Deploying Link-SF

Link-SF has two major pieces, a firebase.com backend and a static HTML/js/css app.
We've gone with a combination of S3 and [fast.ly](http://www.fastly.com) to serve the static app,
although really any old hosting provider could do.


### How to do it

First, setup your `.env.dev` and `.env.prod` file as described in the 'Secrets' section of SETUP.md.

Make a copy of the `s3.json.example` file (stripping off the `.example`) and replace with your Amazon S3 tokens (use the [`region` found here](https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region)). This will get you going with the credentials needed to push to S3.

**TODO** Write about deploying w/ firebase
