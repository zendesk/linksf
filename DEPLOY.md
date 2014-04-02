# Deploying link-sf

link-sf has two major components, a parse.com backend and a static HTML/js/css component.
We've gone with a combination of S3 and [fast.ly](www.fastly.com) to serve the static components, 
although really any old hosting provider could do. 


## setup

First, setup your `.env` file as described in the 'Secrets' section of SETUP.md.  This will get you 
going with the credentials needed to push to S3.

Next, download the parse command line tools as described here: https://parse.com/docs/cloud_code_guide

```
$ curl -s https://www.parse.com/downloads/cloud_code/installer.sh | sudo /bin/bash
```

ensure that you've run grunt -- it will generate the necessary parse configs:

```
$ cd linksf
$ grunt
```

now make sure that parse is accessible:

```
$ cd server
$ parse list

Associated apps are:
* Link SF
  Link SF -- Development

```

Finally, deploy away!

```
$ rake deploy:development
$ rake deploy:production
```

