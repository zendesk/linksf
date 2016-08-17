# Design

## Happy path

Link-SF centers around three core views: home, list, and detail. This is an attempt to shorten the happy path: a service-seeker visits the website (home), picks a category and is shown a list of matching nearby facilities, then drills down into the relevant details for a specific location.

![linksf-flow](https://cloud.githubusercontent.com/assets/279406/2598092/4888a002-babf-11e3-811c-01f86c878e8b.png)

We expect deviations from the happy path to add additional search constraints from the filter view, visit the about and feedback views, or returning to the list view to browse multiple facilities.

There is also a feedback link at the bottom that gives visitors a way to share their thoughts with (optional) contact info.

### Gauging success

Link-SF is designed to connect service-seekers to the facilities that can serve their needs. Thus, tracking successful uses of Link-SF means seeing how frequently users are able to connect to facilities, both in raw volume and as a proportion of all service-seeker visitors.

Our current success metric is to track the number of users that connect externally via calling, getting directions, or visiting the facility website from the detail view. We track this in Google Analytics; just add your analytics token to the `.env` file and redeploy.

## Target browsers & guidelines

We try to make sure Link-SF works for the following browsers:

* Android 2.2+
* iOS 7+
* Evergreen browsers (Chrome, Firefox, IE10+)
* Safari 7+
* Windows Phone 7.8+

For the Tenderloin demographic, the most common phone would be something like an LG Motion. It's best to design something that is useful at a 320x480 resolution. For instance, all service categories on the home view should be displayed above the fold.
