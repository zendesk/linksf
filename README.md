## Link-SF [![Build Status](https://travis-ci.org/zendesk/linksf.svg?branch=master)](https://travis-ci.org/zendesk/linksf) [![Code Climate](https://codeclimate.com/github/zendesk/linksf.png)](https://codeclimate.com/github/zendesk/linksf)

### Open Referral Transition
This version of linksf is currently undergoing a data model transition to be HSDS compliant.

#### [In Active Development] Current Boilerplate

Project structure based on https://github.com/koistya/react-static-boilerplate

http://link-sf.com

A mobile website designed to connect those in need in San Francisco to the services that can help them, on their own terms.

Link-SF is a single page React.js application using [Firebase](https://www.firebase.com/) for persistence. Querying is done in the front-end in order to maintain a mostly backend agnostic application.

Documentation is available under `docs` for offline viewing or via links below:

* [Setup](https://github.com/zendesk/linksf/blob/master/docs/SETUP.md)
* [Design](https://github.com/zendesk/linksf/blob/master/docs/DESIGN.md)
* [Deploy](https://github.com/zendesk/linksf/blob/master/docs/DEPLOY.md)
* [Managing facilities and services](https://github.com/zendesk/linksf/blob/master/docs/MANAGE.md)

Link-SF is an ongoing collaboration between the [Tenderloin Technology Lab](http://www.tenderlointechnologylab.org/) and [Zendesk, Inc](http://www.zendesk.com/).

### History

https://vimeo.com/87203260

The Tenderloin Technology Lab serves many low-income residents that are looking for web access. One of the trends in recent years has been that a significant percentage of users (40% as of February 2014, up from 33% the previous year) have access to smartphones. Low-income households especially are increasingly reliant on smartphones - 45% of smartphone-owning <30k households use mobile web as their primary device for internet access vs 27% of >75k households. Web access and literacy is crucial for job or housing applications, as well as family and social networks.

Link-SF is a mobile web app designed to give this growing community of smartphone users instant access to relevant services on the go by surfacing crucial information like open hours, phone numbers, and Google Maps directions.

Contact us at linksf@zendesk.com.

### Note
In January 2016, Facebook [announced](http://blog.parse.com/announcements/moving-on/) the impending shutdown of the Parse service. Since that time, our team has been working on creating a new solution for all instances of the Link-SF project that does not rely on Parse. Our secondary mission for Version 2 is to support data which is in the [OpenReferral format](https://openreferral.org/) and inspired by the [Ohana API](https://github.com/codeforamerica/ohana-api). This current version uses firebase as a backend and React for the front-end.

For users of our previous version (still available at [this branch](https://github.com/zendesk/linksf/tree/parse-version), we are also building a migrator to help transition to the new version. Contact us at linksf@zendesk.com if you need assistance during this phase.
