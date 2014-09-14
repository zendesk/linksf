To change the icons being used, follow these steps:

1. Locate the current icon set at `/vendor/fontello***.zip`. This is a zipfile of our icons.
1. Go to http://fontello.com/. Click the wrench icon at the top-right, then upload the icon zipfile. You should see the current set of icons circled with red, and the text field next to the wrench should read `icons`.
1. Search through the icons and pick those that best suit your categories. Click the red button at the top right that says 'Download Webfont'. Replace the one currently in the /vendor directory with the new zipfile (so you have a reference for later). Unzip the file.
1. Inside the decompressed zipfile you will see a `font` and `css` folder. Replace all the `icons` files inside of /vendor/font with the new files from the unzipped `font` folder.
1. Replace the `/vendor/css/icons.scss` in with the new `icons.css` from the `css` folder. Make sure you rename the file from `icons.css` to `icons.scss`.
1. Open the new `/vendor/css/icons.scss` file and edit the filepaths near the top of the file from `../font/icons` to `../vendor/font/icons`.
1. Update the `icon` names in `/server/cloud/lib/categories.js` with the new corresponding icon names from the bottom of `../font/icons.scss`.
1. After rebuilding the site with `grunt`, your should now be showing your new icons alongside your new category names.
